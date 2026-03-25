import React, { useState } from 'react';

const RecuperarPassword = ({ irALogin }) => {
  const [idUsuario, setIdUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');

  const handleRecuperar = async (e) => {
    e.preventDefault();
    console.log("1. Botón presionado. Datos a enviar:", { idUsuario, correo, nuevaPassword });

    try {
      console.log("2. Intentando conectar con el backend...");
      const respuesta = await fetch('http://localhost:3001/api/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registro_academico: idUsuario,
          correo: correo,
          nueva_contrasena: nuevaPassword
        }),
      });

      console.log("3. El backend respondió con status:", respuesta.status);
      const data = await respuesta.json();
      console.log("4. Datos recibidos:", data);

      if (respuesta.ok) {
        alert("Exito! " + data.mensaje);
        irALogin(); 
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("ERROR FATAL:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Recuperar Contraseña</h2>
        <p>Ingresa tus datos para verificar tu identidad.</p>

        <form onSubmit={handleRecuperar} style={styles.form}>
          <label>Registro Académico / CUI:</label>
          <input 
            type="text" 
            required 
            value={idUsuario} 
            onChange={(e) => setIdUsuario(e.target.value)} 
            style={styles.input}
          />

          <label>Correo Electrónico:</label>
          <input 
            type="email" 
            required 
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)} 
            style={styles.input}
          />

          <label>Nueva Contraseña:</label>
          <input 
            type="password" 
            required 
            value={nuevaPassword} 
            onChange={(e) => setNuevaPassword(e.target.value)} 
            style={styles.input}
          />

          <button type="submit" style={styles.btnGuardar}>Actualizar Contraseña</button>
          <button type="button" onClick={irALogin} style={styles.btnCancelar}>Volver al Login</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '50px', fontFamily: 'sans-serif' },
  box: { width: '350px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px', textAlign: 'left' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  btnGuardar: { padding: '10px', backgroundColor: '#002855', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  btnCancelar: { padding: '10px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default RecuperarPassword;