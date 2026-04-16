const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Arrocito25',
  database: 'practica_web',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- RUTAS ---

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente ');
});

// Registro
app.post('/api/auth/registro', async (req, res) => {
  const { id_usuario, registro_academico, nombre, apellido, correo, contrasena } = req.body;
  try {
    await db.execute(
      `INSERT INTO Usuario (id_usuario, registro_academico, nombre, apellido, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?)`,
      [id_usuario, registro_academico, nombre, apellido, correo, contrasena]
    );
    res.json({ mensaje: 'Usuario registrado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM Usuario WHERE correo = ? AND contrasena = ?',
      [correo, contrasena]
    );
    if (rows.length > 0) {
      res.json({ mensaje: 'Login correcto', usuario: rows[0] });
    } else {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Obtener Publicaciones
app.get('/api/publicaciones', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id_publicacion, 
        u.nombre AS nombre_usuario, 
        p.mensaje, 
        p.fecha,
        IF(p.id_curso IS NOT NULL, 'Curso', 'Catedrático') AS tipo,
        IFNULL(cu.nombre_curso, CONCAT(ca.nombre, ' ', ca.apellido)) AS referencia
      FROM Publicacion p
      INNER JOIN Usuario u ON p.id_usuario = u.id_usuario
      LEFT JOIN Curso cu ON p.id_curso = cu.id_curso
      LEFT JOIN Catedratico ca ON p.id_catedr = ca.id_catedratico
      ORDER BY p.fecha DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
});

// Crear Publicación
app.post('/api/publicaciones', async (req, res) => {
  const { id_usuario, tipo, referencia_id, mensaje } = req.body;
  const id_publicacion = 'PUB' + Math.floor(Math.random() * 10000);
  let id_curso = tipo === 'curso' ? referencia_id : null;
  let id_catedr = tipo === 'catedratico' ? referencia_id : null;

  try {
    await db.execute(
      `INSERT INTO Publicacion (id_publicacion, id_usuario, id_curso, id_catedr, mensaje, fecha) VALUES (?, ?, ?, ?, ?, NOW())`,
      [id_publicacion, id_usuario, id_curso, id_catedr, mensaje]
    );
    res.json({ mensaje: 'Publicación creada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear publicación' });
  }
});

// Recuperar Contraseña
app.post('/api/recuperar', async (req, res) => {
  const { registro_academico, correo, nueva_contrasena } = req.body;
  try {
    const [user] = await db.execute(
      `SELECT * FROM Usuario WHERE registro_academico = ? AND correo = ?`,
      [registro_academico, correo]
    );
    if (user.length === 0) return res.status(404).json({ error: 'Datos no coinciden' });

    await db.execute(
      `UPDATE Usuario SET contrasena = ? WHERE registro_academico = ?`,
      [nueva_contrasena, registro_academico]
    );
    res.json({ mensaje: 'Contraseña actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error en el proceso' });
  }
});

// --- SECCIÓN DE COMENTARIOS ---
app.post('/api/comentarios', async (req, res) => {
  const { id_publicacion, id_usuario, mensaje } = req.body;
  const id_comentario = 'C-' + Math.floor(Math.random() * 1000000);
  try {
    await db.execute(
      `INSERT INTO Comentario (id_comentario, id_publicacion, id_usuario, mensaje, fecha) VALUES (?, ?, ?, ?, NOW())`,
      [id_comentario, id_publicacion, id_usuario, mensaje]
    );
    res.json({ mensaje: 'Comentario guardado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al comentar' });
  }
});

app.get('/api/comentarios/:id_publicacion', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.*, u.nombre, u.apellido FROM Comentario c 
       JOIN Usuario u ON c.id_usuario = u.id_usuario WHERE c.id_publicacion = ?`,
      [req.params.id_publicacion]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// --- SECCIÓN DE CURSOS ---

// Traer catálogo de cursos (SELECTOR)
app.get('/api/cursos', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id_curso, nombre_curso, creditos, area FROM Curso');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar catálogo' });
  }
});

// Aprobar un curso
app.post('/api/cursos-aprobados', async (req, res) => {
  const { id_usuario, id_curso } = req.body;
  const id_registro = 'REG' + Math.floor(Math.random() * 1000000);
  try {
    await db.execute(
      `INSERT INTO curso_aprobado (id_registro, id_usuario, id_curso, fecha_aprobacion) VALUES (?, ?, ?, NOW())`,
      [id_registro, id_usuario, id_curso]
    );
    res.json({ mensaje: 'Curso aprobado' });
  } catch (err) {
    res.status(500).json({ error: 'Ya has aprobado este curso o hubo un error' });
  }
});

// Ver mis cursos aprobados 
app.get('/api/mis-cursos/:id_usuario', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT ca.id_registro, c.nombre_curso, c.creditos, ca.fecha_aprobacion 
      FROM curso_aprobado ca
      JOIN Curso c ON ca.id_curso = c.id_curso
      WHERE ca.id_usuario = ?`,
      [req.params.id_usuario]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tus cursos' });
  }
});

// Obtener resumen del perfil
app.get('/api/perfil/:id_usuario', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(ca.id_curso) AS total_cursos,
        IFNULL(SUM(CAST(c.creditos AS UNSIGNED)), 0) AS total_creditos
      FROM curso_aprobado ca
      JOIN Curso c ON ca.id_curso = c.id_curso
      WHERE ca.id_usuario = ?`;

    const [rows] = await db.execute(query, [req.params.id_usuario]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener resumen de perfil' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});