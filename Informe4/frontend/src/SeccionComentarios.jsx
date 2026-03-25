import React, { useState, useEffect } from 'react';

const SeccionComentarios = ({ idPublicacion }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));

  const obtenerComentarios = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/comentarios/${idPublicacion}`);
      if (res.ok) {
        const data = await res.json();
        setComentarios(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Error cargando comentarios:", e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerComentarios();
  }, [idPublicacion]);

  const enviarComentario = async () => {
    if (!nuevoMensaje.trim()) return;

    try {
      const res = await fetch('http://localhost:3001/api/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_publicacion: idPublicacion,
          id_usuario: usuario.id_usuario,
          mensaje: nuevoMensaje
        })
      });

      if (res.ok) {
        setNuevoMensaje('');
        obtenerComentarios();
      }
    } catch (e) {
      console.error("Error al enviar:", e);
    }
  };

  if (cargando) return <p style={{ fontSize: '12px', color: '#666' }}>Cargando comentarios...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.lista}>
        {comentarios.map((com) => (
          <div key={com.id_comentario} style={styles.burbuja}>
            <div style={styles.header}>
              <div style={styles.avatar}>{com.nombre ? com.nombre[0] : 'U'}</div>
              <div style={styles.info}>
                <strong>{com.nombre} {com.apellido}</strong>
                <span>{new Date(com.fecha).toLocaleString()}</span>
              </div>
            </div>
            <p style={styles.texto}>{com.mensaje}</p>
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input 
          style={styles.input}
          placeholder="Escribe un comentario..."
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
        />
        <button onClick={enviarComentario} style={styles.btn}>Enviar</button>
      </div>
    </div>
  );
};

const styles = {
  container: { marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' },
  lista: { maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' },
  burbuja: { backgroundColor: 'white', padding: '10px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #eee' },
  header: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' },
  avatar: { width: '25px', height: '25px', borderRadius: '50%', backgroundColor: '#002855', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' },
  info: { display: 'flex', flexDirection: 'column', fontSize: '11px' },
  texto: { margin: '5px 0 0 35px', fontSize: '14px', color: '#333' },
  inputArea: { display: 'flex', gap: '5px' },
  input: { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' },
  btn: { padding: '8px 15px', backgroundColor: '#002855', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default SeccionComentarios;