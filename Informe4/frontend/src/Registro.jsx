import React, { useState } from 'react';

// Este componente recibe la función 'irALogin' desde App.jsx para poder volver
const Registro = ({ irALogin }) => {
  // 1. Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    id_usuario: '',
    registro_academico: '',
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: ''
  });

  // Estado para mostrar mensajes de error o éxito
  const [mensaje, setMensaje] = useState('');

  // 2. Función para capturar los cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // Captura el valor usando el atributo 'name' del input
    });
  };

  // 3. Función para enviar los datos al servidor al hacer 'submit'
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setMensaje('Procesando registro...');

    try {
      // Petición POST al backend
      const respuesta = await fetch('http://localhost:3001/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Enviamos todo el objeto formData
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        // Registro exitoso
        alert("¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.");
        irALogin(); // Redirigimos automáticamente al Login
      } else {
        // El servidor devolvió un error (ej. usuario duplicado)
        setMensaje('Error: ' + (data.message || 'No se pudo completar el registro.'));
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Registro de Estudiante</h2>
        <p style={styles.subtitulo}>Facultad de Ingeniería - USAC</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Fila 1: ID y Registro Académico */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID Usuario (Nickname):</label>
              <input 
                type="text"
                name="id_usuario" 
                value={formData.id_usuario} 
                onChange={handleChange} 
                placeholder="ej. andre25"
                required 
                style={styles.input} 
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Registro Académico:</label>
              <input 
                type="text"
                name="registro_academico" 
                value={formData.registro_academico} 
                onChange={handleChange} 
                placeholder="202300000"
                required 
                style={styles.input} 
              />
            </div>
          </div>

          {/* Fila 2: Nombre y Apellido */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre:</label>
              <input 
                type="text"
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Apellido:</label>
              <input 
                type="text"
                name="apellido" 
                value={formData.apellido} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
            </div>
          </div>

          {/* Correo */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico:</label>
            <input 
              type="email" 
              name="correo" 
              value={formData.correo} 
              onChange={handleChange} 
              placeholder="estudiante@ingenieria.usac.edu.gt"
              required 
              style={styles.input} 
            />
          </div>

          {/* Contraseña */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña:</label>
            <input 
              type="password" 
              name="contrasena" 
              value={formData.contrasena} 
              onChange={handleChange} 
              required 
              style={styles.input} 
            />
          </div>

          <button type="submit" style={styles.button}>
            Crear Cuenta
          </button>
        </form>

        {/* Mensajes de error/estado */}
        {mensaje && (
          <p style={{ 
            ...styles.mensaje, 
            color: mensaje.includes('Error') ? '#d9534f' : '#002855' 
          }}>
            {mensaje}
          </p>
        )}

        {/* Enlace para volver */}
        <div style={styles.footer}>
          ¿Ya tienes cuenta? <span onClick={irALogin} style={styles.link}>Inicia Sesión aquí</span>
        </div>
      </div>
    </div>
  );
};

// --- ESTILOS (Similares al Login para consistencia) ---
const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh', 
    backgroundColor: '#f4f7f6', // Fondo gris muy claro
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    padding: '20px'
  },
  card: { 
    maxWidth: '550px', 
    width: '100%', 
    backgroundColor: 'white', 
    padding: '40px', 
    borderRadius: '15px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
    textAlign: 'center' 
  },
  titulo: { color: '#002855', margin: '0 0 5px 0', fontSize: '28px' },
  subtitulo: { color: '#666', margin: '0 0 30px 0', fontSize: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  row: { display: 'flex', gap: '15px', flexDirection: 'row' }, // Inputs lado a lado en PC
  inputGroup: { flex: 1, textAlign: 'left' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' },
  input: { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    boxSizing: 'border-box', 
    fontSize: '14px',
    outline: 'none'
  },
  button: { 
    padding: '15px', 
    backgroundColor: '#28a745', // Verde para éxito/creación
    color: 'white', 
    border: 'none', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    borderRadius: '8px', 
    fontSize: '16px', 
    marginTop: '15px',
    transition: 'background-color 0.3s'
  },
  mensaje: { marginTop: '20px', fontSize: '14px', fontWeight: '500' },
  footer: { marginTop: '25px', fontSize: '14px', color: '#666' },
  link: { color: '#007bff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }
};

// Soporte básico para móviles (hace que las filas se vuelvan columnas)
const mediaQuery = window.matchMedia('(max-width: 600px)');
if (mediaQuery.matches) {
  styles.row.flexDirection = 'column';
  styles.row.gap = '15px';
}

export default Registro;