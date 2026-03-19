const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const mysql    = require('mysql2/promise');

const app    = express();
const PORT   = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Arrocito25',
  database: 'practica_web'
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

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

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});