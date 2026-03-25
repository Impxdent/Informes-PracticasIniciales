import React, { useState, useEffect } from 'react';

const SeccionComentarios = ({ idPublicacion }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');

  const obtenerComentarios = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3001/api/comentarios/${idPublicacion}`);
      if (respuesta.ok) {
        const data = await respuesta.json();
        setComentarios(data);
      }
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  useEffect(() => {
    obtenerComentarios();
  }, [idPublicacion]);

    const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;

    const usuarioRaw = localStorage.getItem('usuarioActivo');
    if (!usuarioRaw) {
        alert("Sesión expirada. Por favor, vuelve a entrar.");
        return;
    }
    
    const usuario = JSON.parse(usuarioRaw);
    const idUsuarioFinal = usuario.id_usuario || usuario.registro_academico; 

    try {
        const respuesta = await fetch('http://localhost:3001/api/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_publicacion: idPublicacion,
            id_usuario: idUsuarioFinal, 
            mensaje: nuevoComentario
        }),
        });

        if (respuesta.ok) {
        setNuevoComentario('');
        obtenerComentarios(); 
        } else {
        const errorData = await respuesta.json();
        console.error("Error del servidor:", errorData.error);
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
    };

  return (
    <div style={styles.container}>
      <div style={styles.lista}>
        <h4 style={{ fontSize: '12px', color: '#666' }}>DEBUG: Lista de Comentarios</h4>
        
        {comentarios.length > 0 ? (
          comentarios.map((c, index) => (
            <div key={index} style={{ 
              padding: '10px', 
              marginBottom: '5px', 
              backgroundColor: '#eee', 
              borderRadius: '4px',
              fontSize: '11px',
              fontFamily: 'monospace',
              border: '1px solid #ccc'
            }}>
              <strong>Objeto recibido:</strong>
              <pre>{JSON.stringify(c, null, 2)}</pre>
            </div>
          ))
        ) : (
          <div style={{ padding: '10px', border: '1px dashed red' }}>
            <p style={{ color: 'red', fontSize: '13px' }}>
              Estado actual: <strong>Vacío ([])</strong>. 
              No se recibieron datos del backend para la publicación: {idPublicacion}
            </p>
          </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <input 
          type="text" 
          placeholder="Escribe un comentario..." 
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          style={styles.input}
        />
        <button onClick={enviarComentario} style={styles.btnEnviar}>Enviar</button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' },
  lista: { marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' },
  comentarioItem: { padding: '8px', borderBottom: '1px solid #eee', marginBottom: '5px' },
  inputArea: { display: 'flex', gap: '5px' },
  input: { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  btnEnviar: { padding: '8px 15px', backgroundColor: '#002855', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default SeccionComentarios;