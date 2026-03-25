import React, { useState, useEffect } from 'react';
import SeccionComentarios from './SeccionComentarios';

const PantallaPrincipal = ({ cerrarSesion }) => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('curso'); 
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState('curso');
  const [nuevaReferenciaId, setNuevaReferenciaId] = useState('');
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [publicacionAbierta, setPublicacionAbierta] = useState(null);

  const obtenerPublicaciones = async () => {
    try {
      const respuesta = await fetch('http://localhost:3001/api/publicaciones');
      if (respuesta.ok) {
        const data = await respuesta.json();
        setPublicaciones(data);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };

  useEffect(() => {
    obtenerPublicaciones();
  }, []);

  const handleCrearPublicacion = async (e) => {
    e.preventDefault(); 
    const usuarioString = localStorage.getItem('usuarioActivo');
    if (!usuarioString) {
      alert("Error: No se encontró el usuario activo.");
      return;
    }
    const usuario = JSON.parse(usuarioString);

    try {
      console.log("Enviando datos al servidor..."); 
      
      const respuesta = await fetch('http://localhost:3001/api/publicaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          tipo: nuevoTipo,
          referencia_id: nuevaReferenciaId,
          mensaje: nuevoMensaje
        }),
      });

      console.log("Respuesta del servidor:", respuesta.status);

      if (respuesta.ok) {
        alert("Publicación guardada exitosamente!");
        setMostrarFormulario(false);
        setNuevaReferenciaId('');
        setNuevoMensaje('');
        obtenerPublicaciones(); 
      } else {
        alert("Error en la base de datos");
      }
    } catch (error) {
      alert("Error de red");
      console.error('Error atrapado:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Foro de Ingeniería USAC</h2>
        <button onClick={cerrarSesion} style={styles.btnSalir}>Cerrar Sesión</button>
      </div>

      <div style={styles.filtros}>
        <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} style={styles.select}>
          <option value="curso">Buscar por Nombre de Curso</option>
          <option value="catedratico">Buscar por Nombre de Catedrático</option>
        </select>
        <input 
          type="text" 
          placeholder={`Buscar...`} 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.inputBusqueda}
        />
        <button style={styles.btnBuscar}>Filtrar</button>
      </div>

      <div style={styles.btnCrearContenedor}>
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={styles.btnCrear}>
          {mostrarFormulario ? 'Cancelar' : '+ Crear Nueva Publicación'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleCrearPublicacion} style={styles.formularioBox}>
          <h3>Nueva Publicación</h3>
          <label>¿Sobre qué quieres opinar?</label>
          <select value={nuevoTipo} onChange={(e) => setNuevoTipo(e.target.value)} style={styles.inputForm}>
            <option value="curso">Curso</option>
            <option value="catedratico">Catedrático</option>
          </select>

          <label>ID del {nuevoTipo === 'curso' ? 'Curso (ej. C001)' : 'Catedrático (ej. CAT01)'}:</label>
          <input 
            type="text" 
            maxLength="10"
            required 
            value={nuevaReferenciaId} 
            onChange={(e) => setNuevaReferenciaId(e.target.value)} 
            style={styles.inputForm}
          />

          <label>Mensaje (máx. 50 caracteres):</label>
          <textarea 
            maxLength="50" 
            required 
            value={nuevoMensaje} 
            onChange={(e) => setNuevoMensaje(e.target.value)} 
            style={{...styles.inputForm, resize: 'none', height: '60px'}}
          />

          <button type="submit" style={styles.btnGuardar}>Guardar Publicación</button>
        </form>
      )}

        <div style={styles.listaPublicaciones}>
        {publicaciones.map((pub) => (
            <div key={pub.id_publicacion} style={styles.card}>
            <div style={styles.cardHeader}>
                <strong>{pub.nombre_usuario}</strong> publicó sobre el {pub.tipo}: <em>{pub.referencia}</em>
            </div>
            
            <p style={styles.cardMensaje}>{pub.mensaje}</p>
            
            <div style={styles.cardFooter}>
                <small>Fecha: {new Date(pub.fecha).toLocaleString()}</small>
                <button 
                style={styles.btnComentar} 
                onClick={() => setPublicacionAbierta(publicacionAbierta === pub.id_publicacion ? null : pub.id_publicacion)}
                >
                {publicacionAbierta === pub.id_publicacion ? 'Ocultar' : 'Ver/Comentar'}
                </button>
            </div>

            {publicacionAbierta === pub.id_publicacion && (
                <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <SeccionComentarios idPublicacion={pub.id_publicacion} />
                </div>
            )}
            </div>
        ))}
        </div>
    </div>
  );
};

//nuevo diseño
const styles = {
  container: { maxWidth: '800px', margin: '20px auto', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#002855', color: 'white', padding: '10px 20px', borderRadius: '8px' },
  btnSalir: { padding: '8px 15px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  filtros: { display: 'flex', gap: '10px', marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' },
  select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  inputBusqueda: { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  btnBuscar: { padding: '8px 15px', backgroundColor: '#5bc0de', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnCrearContenedor: { marginTop: '15px', textAlign: 'right' },
  btnCrear: { padding: '10px 20px', backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  formularioBox: { marginTop: '15px', padding: '15px', border: '2px dashed #5cb85c', borderRadius: '8px', backgroundColor: '#f9fff9', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' },
  inputForm: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' },
  btnGuardar: { padding: '10px', backgroundColor: '#002855', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  listaPublicaciones: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  cardHeader: { borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' },
  cardMensaje: { fontSize: '16px', color: '#333' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', color: '#777' },
  btnComentar: { padding: '5px 10px', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default PantallaPrincipal;