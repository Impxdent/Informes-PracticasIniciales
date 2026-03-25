import React, { useState, useEffect } from 'react';

const PantallaPrincipal = ({ cerrarSesion }) => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('curso');

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      try {
        const respuesta = await fetch('http://localhost:3001/api/publicaciones');
        if (respuesta.ok) {
          const data = await respuesta.json();
          setPublicaciones(data);
        } else {
          console.error('Error al cargar publicaciones');
        }
      } catch (error) {
        console.error('Error de conexión:', error);
      }
    };

    obtenerPublicaciones();
  }, []);

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
          placeholder={`Buscar ${tipoFiltro}...`} 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.inputBusqueda}
        />
        <button style={styles.btnBuscar}>Filtrar</button>
      </div>

      <div style={styles.btnCrearContenedor}>
        <button style={styles.btnCrear}>+ Crear Nueva Publicación</button>
      </div>

      <div style={styles.listaPublicaciones}>
        {publicaciones.map((pub) => (
          <div key={pub.id_publicacion} style={styles.card}>
            <div style={styles.cardHeader}>
              <strong>{pub.nombre_usuario}</strong> publicó sobre el {pub.tipo}: <em>{pub.referencia}</em>
            </div>
            <p style={styles.cardMensaje}>{pub.mensaje}</p>
            <div style={styles.cardFooter}>
              <small>Fecha: {pub.fecha}</small>
              <button style={styles.btnComentar}>Ver/Comentar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

//diseño provisional
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
  listaPublicaciones: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  cardHeader: { borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' },
  cardMensaje: { fontSize: '16px', color: '#333' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', color: '#777' },
  btnComentar: { padding: '5px 10px', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default PantallaPrincipal;