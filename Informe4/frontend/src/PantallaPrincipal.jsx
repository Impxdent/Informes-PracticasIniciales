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
    
    const coincideTipo = pub.tipo.toLowerCase() === tipoFiltro.toLowerCase();

    const coincideBusqueda = pub.referencia.toLowerCase().includes(busqueda.toLowerCase());

    return coincideTipo && coincideBusqueda;
  });

  const handleCrearPublicacion = async (e) => {
    e.preventDefault(); 
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));

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
        alert("Publicación creada!");
        setMostrarFormulario(false);
        setNuevaReferenciaId('');
        setNuevoMensaje('');
        obtenerPublicaciones(); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{margin: 0}}>Foro Ingeniería USAC</h2>
        <button onClick={cerrarSesion} style={styles.btnSalir}>Cerrar Sesión</button>
      </div>

      <div style={styles.filtros}>
        <div style={{flex: 1}}>
          <label style={styles.labelFiltro}>Filtrar por:</label>
          <select 
            value={tipoFiltro} 
            onChange={(e) => setTipoFiltro(e.target.value)} 
            style={styles.select}
          >
            <option value="curso">Cursos</option>
            <option value="catedratico">Catedráticos</option>
          </select>
        </div>
        
        <div style={{flex: 2}}>
          <label style={styles.labelFiltro}>Escribe el nombre:</label>
          <input 
            type="text" 
            placeholder={`Buscar ${tipoFiltro}...`} 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.inputBusqueda}
          />
        </div>
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
            <select value={nuevoTipo} onChange={(e) => setNuevoTipo(e.target.value)} style={styles.inputForm}>
              <option value="curso">Curso</option>
              <option value="catedratico">Catedrático</option>
            </select>
            <input 
              placeholder="ID (C001 o CAT01)"
              value={nuevaReferenciaId} 
              onChange={(e) => setNuevaReferenciaId(e.target.value)} 
              style={styles.inputForm}
              required
            />
          </div>
          <textarea 
            placeholder="¿Qué piensas?..."
            value={nuevoMensaje} 
            onChange={(e) => setNuevoMensaje(e.target.value)} 
            style={{...styles.inputForm, height: '70px', resize: 'none'}}
            required
          />
          <button type="submit" style={styles.btnGuardar}>Publicar</button>
        </form>
      )}

      <div style={styles.listaPublicaciones}>
        {publicacionesFiltradas.length > 0 ? (
          publicacionesFiltradas.map((pub) => (
            <div key={pub.id_publicacion} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.badge}>{pub.tipo}</span>
                <strong>{pub.nombre_usuario}</strong> sobre <b>{pub.referencia}</b>
              </div>
              <p style={styles.cardMensaje}>{pub.mensaje}</p>
              <div style={styles.cardFooter}>
                <small>{new Date(pub.fecha).toLocaleDateString()}</small>
                <button 
                  style={styles.btnComentar} 
                  onClick={() => setPublicacionAbierta(publicacionAbierta === pub.id_publicacion ? null : pub.id_publicacion)}
                >
                  {publicacionAbierta === pub.id_publicacion ? 'Ocultar' : 'Comentarios'}
                </button>
              </div>

              {publicacionAbierta === pub.id_publicacion && (
                <SeccionComentarios idPublicacion={pub.id_publicacion} />
              )}
            </div>
          ))
        ) : (
          <div style={{textAlign: 'center', padding: '40px', color: '#888'}}>
             No hay publicaciones que coincidan con "{busqueda}" en la categoría {tipoFiltro}.
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '750px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#002855', color: 'white', padding: '15px 20px', borderRadius: '12px' },
  btnSalir: { backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' },
  filtros: { display: 'flex', gap: '15px', marginTop: '20px', padding: '20px', backgroundColor: '#f0f2f5', borderRadius: '12px', alignItems: 'flex-end' },
  labelFiltro: { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: '#555' },
  select: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  inputBusqueda: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
  btnCrearContenedor: { marginTop: '15px', textAlign: 'right' },
  btnCrear: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  formularioBox: { marginTop: '15px', padding: '20px', border: '1px solid #28a745', borderRadius: '12px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '10px' },
  inputForm: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  btnGuardar: { padding: '12px', backgroundColor: '#002855', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  listaPublicaciones: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' },
  cardHeader: { fontSize: '14px', color: '#666', marginBottom: '10px' },
  badge: { backgroundColor: '#e7f3ff', color: '#007bff', padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold', marginRight: '10px' },
  cardMensaje: { fontSize: '16px', color: '#333', margin: '10px 0' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px solid #f0f2f5', paddingTop: '10px' },
  btnComentar: { backgroundColor: '#f0ad4e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default PantallaPrincipal;