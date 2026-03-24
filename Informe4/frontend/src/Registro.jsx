import React, { useState } from 'react';

const Registro = ({ irALogin }) => {
  const [id_usuario, setIdUsuario] = useState('');
  const [registro_academico, setRegistroAcademico] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch('http://localhost:3001/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_usuario, registro_academico, nombre, apellido, correo, contrasena 
        }),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje('✅ ' + data.mensaje);
        setIdUsuario(''); setRegistroAcademico(''); setNombre(''); 
        setApellido(''); setCorreo(''); setContrasena('');
      } else {
        setMensaje('❌ Error: Verifica tus datos');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error al conectar con el servidor.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        <div style={styles.inputGroup}>
          <label>CUI (Registro Personal):</label>
          <input type="text" maxLength="10" value={id_usuario} onChange={(e) => setIdUsuario(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Registro Académico:</label>
          <input type="text" maxLength="10" value={registro_academico} onChange={(e) => setRegistroAcademico(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Nombre:</label>
          <input type="text" maxLength="25" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Apellido:</label>
          <input type="text" maxLength="25" value={apellido} onChange={(e) => setApellido(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Correo Electrónico:</label>
          <input type="email" maxLength="50" value={correo} onChange={(e) => setCorreo(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Contraseña:</label>
          <input type="password" maxLength="20" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required style={styles.input} />
        </div>

        <button type="submit" style={styles.button}>Registrarse</button>
      </form>

      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}

      <div style={styles.links}>
        <span onClick={irALogin} style={styles.linkText}>¿Ya tienes cuenta? Iniciar Sesión</span>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '400px', margin: '30px auto', textAlign: 'center', fontFamily: 'sans-serif', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
  inputGroup: { textAlign: 'left' },
  input: { width: '100%', padding: '8px', marginTop: '2px', boxSizing: 'border-box' },
  button: { padding: '10px', backgroundColor: '#002855', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', marginTop: '10px' },
  mensaje: { marginTop: '15px', fontWeight: 'bold' },
  links: { marginTop: '20px', fontSize: '14px' },
  linkText: { color: 'blue', textDecoration: 'underline', cursor: 'pointer' }
};

export default Registro;