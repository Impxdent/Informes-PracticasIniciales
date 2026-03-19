const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const mysql    = require('mysql2/promise');

const app    = express();
const PORT   = 3001;

app.use(cors());
app.use(express.json());

// 🔌 CONEXIÓN A MYSQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Arrocito25',
  database: 'practica_web'
});

// 🔥 RUTA PRINCIPAL (para probar)
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// ================= AUTH =================

// REGISTRO
app.post('/api/auth/registro', async (req, res) => {
  const { id_usuario, registro_academico, nombre, apellido, correo, contrasena } = req.body;

  try {
    await db.execute(
      `INSERT INTO Usuario 
      (id_usuario, registro_academico, nombre, apellido, correo, contrasena)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id_usuario, registro_academico, nombre, apellido, correo, contrasena]
    );

    res.json({ mensaje: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  const [rows] = await db.execute(
    'SELECT * FROM Usuario WHERE correo = ? AND contrasena = ?',
    [correo, contrasena]
  );

  if (rows.length > 0) {
    res.json({ mensaje: 'Login correcto', usuario: rows[0] });
  } else {
    res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }
});

// ================= PUBLICACIONES =================

// VER PUBLICACIONES
app.get('/api/publicaciones', async (req, res) => {
  const [rows] = await db.execute(`
    SELECT p.*, u.nombre
    FROM Publicacion p
    JOIN Usuario u ON p.id_usuario = u.id_usuario
    ORDER BY p.fecha DESC
  `);

  res.json(rows);
});

// CREAR PUBLICACIÓN
app.post('/api/publicaciones', async (req, res) => {
  const { id_publicacion, id_usuario, id_curso, id_catedr, mensaje } = req.body;

  await db.execute(`
    INSERT INTO Publicacion
    (id_publicacion, id_usuario, id_curso, id_catedr, mensaje, fecha)
    VALUES (?, ?, ?, ?, ?, NOW())
  `, [id_publicacion, id_usuario, id_curso, id_catedr, mensaje]);

  res.json({ mensaje: 'Publicación creada' });
});

// ================= COMENTARIOS =================

// GET comentarios
app.get('/api/publicaciones/:id/comentarios', async (req, res) => {
  const [rows] = await db.execute(`
    SELECT c.*, u.nombre
    FROM Comentario c
    JOIN Usuario u ON c.id_usuario = u.id_usuario
    WHERE c.id_publicacion = ?
  `, [req.params.id]);

  res.json(rows);
});

// POST comentario
app.post('/api/publicaciones/:id/comentarios', async (req, res) => {
  const { id_comentario, id_usuario, mensaje } = req.body;

  await db.execute(`
    INSERT INTO Comentario
    (id_comentario, id_publicacion, id_usuario, mensaje, fecha)
    VALUES (?, ?, ?, ?, NOW())
  `, [id_comentario, req.params.id, id_usuario, mensaje]);

  res.json({ mensaje: 'Comentario agregado' });
});

// ================= CATÁLOGOS =================

app.get('/api/cursos', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM Curso');
  res.json(rows);
});

app.get('/api/catedraticos', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM Catedratico');
  res.json(rows);
});

// ================= INICIO =================

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});