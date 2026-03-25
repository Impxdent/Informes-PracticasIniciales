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

  const publicacionesFiltradas = publicaciones.filter(pub => {
    if (!busqueda) return true;
    const termino = busqueda.toLowerCase();
    return pub.referencia.toLowerCase().includes(termino);
  });

  const handleCrearPublicacion = async (e) => {
    e.preventDefault(); 
    const usuarioString = localStorage.getItem('usuarioActivo');
    if (!usuarioString) {
      alert("Error: No se encontró el usuario activo.");
      return;
    }
    const usuario = JSON.parse(usuarioString);

    try {
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

      if (respuesta.ok) {
        alert("¡Publicación creada!");
        setMostrarFormulario(false);
        setNuevaReferenciaId('');
        setNuevoMensaje('');
        obtenerPublicaciones(); 
      } else {
        alert("Error al guardar. Verifica que el ID del curso/catedrático exista.");
      }
    } catch (error) {
      alert("Error de red");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{margin: 0}}>Foro de Ingeniería USAC</h2>
        <button onClick={cerrarSesion} style={styles.btnSalir}>Cerrar Sesión</button>
      </div>

      <div style={styles.filtros}>
        <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} style={styles.select}>
          <option value="curso">Nombre de Curso</option>
          <option value="catedratico">Nombre de Catedrático</option>
        </select>
        <input 
          type="text" 
          placeholder={`Buscar ${tipoFiltro}...`} 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.inputBusqueda}
        />
      </div>

      <div style={styles.btnCrearContenedor}>
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} style={styles.btnCrear}>
          {mostrarFormulario ? '✕ Cancelar' : '+ Nueva Publicación'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleCrearPublicacion} style={styles.formularioBox}>
          <h3 style={{margin: '0 0 10px 0', color: '#002855'}}>Nueva Publicación</h3>
          
          <div style={{display: 'flex', gap: '10px'}}>
            <div style={{flex: 1}}>
              <label style={styles.label}>¿Sobre qué opinas?</label>
              <select value={nuevoTipo} onChange={(e) => setNuevoTipo(e.target.value)} style={styles.inputForm}>
                <option value="curso">Curso</option>
                <option value="catedratico">Catedrático</option>
              </select>
            </div>
            <div style={{flex: 1}}>
              <label style={styles.label}>ID (ej. C001 / CAT01):</label>
              <input 
                type="text" 
                required 
                value={nuevaReferenciaId} 
                onChange={(e) => setNuevaReferenciaId(e.target.value)} 
                style={styles.inputForm}
              />
            </div>
          </div>

          <label style={styles.label}>Mensaje:</label>
          <textarea 
            maxLength="200" 
            required 
            placeholder="Escribe tu opinión aquí..."
            value={nuevoMensaje} 
            onChange={(e) => setNuevoMensaje(e.target.value)} 
            style={{...styles.inputForm, resize: 'none', height: '80px'}}
          />

          <button type="submit" style={styles.btnGuardar}>Publicar en el Foro</button>
        </form>
      )}

      <div style={styles.listaPublicaciones}>
        {publicacionesFiltradas.length > 0 ? (
          publicacionesFiltradas.map((pub) => (
            <div key={pub.id_publicacion} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.badge}>{pub.tipo}</span>
                <strong>{pub.nombre_usuario}</strong> opinó sobre: 
                <span style={{color: '#002855', fontWeight: 'bold'}}> {pub.referencia}</span>
              </div>
              
              <p style={styles.cardMensaje}>{pub.mensaje}</p>
              
              <div style={styles.cardFooter}>
                <small> {new Date(pub.fecha).toLocaleString()}</small>
                <button 
                  style={{
                    ...styles.btnComentar,
                    backgroundColor: publicacionAbierta === pub.id_publicacion ? '#666' : '#f0ad4e'
                  }} 
                  onClick={() => setPublicacionAbierta(publicacionAbierta === pub.id_publicacion ? null : pub.id_publicacion)}
                >
                  {publicacionAbierta === pub.id_publicacion ? 'Ocultar' : 'Ver Comentarios'}
                </button>
              </div>

              {publicacionAbierta === pub.id_publicacion && (
                <SeccionComentarios idPublicacion={pub.id_publicacion} />
              )}
            </div>
          ))
        ) : (
          <p style={{textAlign: 'center', color: '#999', marginTop: '30px'}}>No se encontraron publicaciones.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#002855', color: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  btnSalir: { padding: '8px 15px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  filtros: { display: 'flex', gap: '10px', marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #eee' },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' },
  inputBusqueda: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' },
  btnCrearContenedor: { marginTop: '15px', textAlign: 'right' },
  btnCrear: { padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' },
  formularioBox: { marginTop: '15px', padding: '20px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #28a745', boxShadow: '0 4px 12px rgba(40, 167, 69, 0.1)', display: 'flex', flexDirection: 'column', gap: '12px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '-8px' },
  inputForm: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box', fontSize: '14px' },
  btnGuardar: { padding: '12px', backgroundColor: '#002855', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  listaPublicaciones: { marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #eef0f2', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  cardHeader: { borderBottom: '1px solid #f0f2f5', paddingBottom: '12px', marginBottom: '12px', fontSize: '14px', color: '#666' },
  badge: { backgroundColor: '#e7f3ff', color: '#007bff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginRight: '10px', textTransform: 'uppercase' },
  cardMensaje: { fontSize: '17px', color: '#1c1e21', margin: '10px 0', lineHeight: '1.5' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px solid #f0f2f5', paddingTop: '12px' },
  btnComentar: { padding: '8px 16px', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }
};

export default PantallaPrincipal;