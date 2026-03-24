import React, { useState } from 'react';

const Login = ({irARegistro}) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje('✅ ' + data.mensaje);
        localStorage.setItem('usuarioActivo', JSON.stringify(data.usuario));
        
        // agregar pantalla 
        
      } else {
        setMensaje('Credenciales incorrectas' + data.mensaje);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al conectar con el servidor');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Inicio de Sesión - Ingeniería</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Correo Electrónico:</label>
          <input 
            type="email" 
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="ejemplo@correo.com"
            required 
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Tu contraseña"
            required 
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Iniciar Sesión
        </button>
      </form>

      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
      
      <div style={styles.links}>
        <span onClick={irARegistro} style={{color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}>Registrarse</span>
         | <a href="/recuperar">Recuperar contraseña</a>
      </div>
    </div>
  );
};

//diseño (tal vez modificar después)
const styles = {
  container: { maxWidth: '400px', margin: '50px auto', textAlign: 'center', fontFamily: 'sans-serif', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  inputGroup: { textAlign: 'left' },
  input: { width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' },
  button: { padding: '10px', backgroundColor: '#002855', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' },
  mensaje: { marginTop: '15px', fontWeight: 'bold' },
  links: { marginTop: '20px', fontSize: '14px' }
};

export default Login;