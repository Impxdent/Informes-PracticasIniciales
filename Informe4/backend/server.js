const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const mysql    = require('mysql2/promise');

const app    = express();
const PORT   = 3001;
const SECRET = 'clave_super_secreta';

app.use(cors());
app.use(express.json());

// 🔌 CONEXIÓN A MYSQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root', // cambia si es necesario
  database: 'practica_web'
});

// 🔐 MIDDLEWARE TOKEN
function verificarToken(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    req.usuario = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
}

// ================= AUTH =================

// REGISTRO
app.post('/api/auth/registro', async (req, res) => {
  const { id_usuario, registro_academico, nombre, apellido, correo, contraseña } = req.body;

  try {
    const hash = await bcrypt.hash(contraseña, 10);

    await db.execute(
      `INSERT INTO Usuario 
      (id_usuario, registro_academico, nombre, apellido, correo, contraseña)
      VALUES (?,?,?,?,?,?)`,
      [id_usuario, registro_academico, nombre, apellido, correo, hash]
    );

    res.json({ mensaje: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  const [rows] = await db.execute(
    'SELECT * FROM Usuario WHERE correo = ?',
    [correo]
  );

  const usuario = rows[0];

  if (!usuario) return res.status(401).json({ error: 'No existe usuario' });

  const valido = await bcrypt.compare(contraseña, usuario.contraseña);

  if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign(
    { id: usuario.id_usuario, nombre: usuario.nombre },
    SECRET
  );

  res.json({ token, usuario });
});

// ================= PUBLICACIONES =================

// GET publicaciones
app.get('/api/publicaciones', verificarToken, async (req, res) => {
  const [rows] = await db.execute(`
    SELECT p.*, u.nombre, u.apellido
    FROM Publicacion p
    JOIN Usuario u ON p.id_usuario = u.id_usuario
    ORDER BY p.fecha DESC
  `);

  res.json(rows);
});

// POST publicación
app.post('/api/publicaciones', verificarToken, async (req, res) => {
  const { id_publicacion, id_curso, id_catedr, mensaje } = req.body;

  await db.execute(
    `INSERT INTO Publicacion
    (id_publicacion, id_usuario, id_curso, id_catedr, mensaje, fecha)
    VALUES (?, ?, ?, ?, ?, NOW())`,
    [id_publicacion, req.usuario.id, id_curso, id_catedr, mensaje]
  );

  res.json({ mensaje: 'Publicación creada' });
});

// ================= COMENTARIOS =================

// GET comentarios
app.get('/api/publicaciones/:id/comentarios', verificarToken, async (req, res) => {
  const [rows] = await db.execute(`
    SELECT c.*, u.nombre
    FROM Comentario c
    JOIN Usuario u ON c.id_usuario = u.id_usuario
    WHERE c.id_publicacion = ?
  `, [req.params.id]);

  res.json(rows);
});

// POST comentario
app.post('/api/publicaciones/:id/comentarios', verificarToken, async (req, res) => {
  const { id_comentario, mensaje } = req.body;

  await db.execute(`
    INSERT INTO Comentario
    (id_comentario, id_publicacion, id_usuario, mensaje, fecha)
    VALUES (?, ?, ?, ?, NOW())
  `, [id_comentario, req.params.id, req.usuario.id, mensaje]);

  res.json({ mensaje: 'Comentario agregado' });
});

// ================= CATÁLOGOS =================

app.get('/api/cursos', verificarToken, async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM Curso');
  res.json(rows);
});

app.get('/api/catedraticos', verificarToken, async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM Catedratico');
  res.json(rows);
});

// ================= INICIO =================

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});