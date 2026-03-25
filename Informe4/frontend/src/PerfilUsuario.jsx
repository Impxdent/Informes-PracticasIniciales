import React, { useState, useEffect } from 'react';

const PerfilUsuario = ({ irAForo }) => {
  const [resumen, setResumen] = useState({ total_cursos: 0, total_creditos: 0 });
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/perfil/${usuario.id_usuario}`);
        const data = await res.json();
        setResumen(data);
      } catch (e) { console.error(e); }
    };
    if (usuario) cargarPerfil();
  }, [usuario]);

  if (!usuario) return <p>Inicia sesión para ver tu perfil.</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'left', marginBottom: '10px' }}>
          <button onClick={irAForo} style={styles.btnVolver}>
            ← Volver al Foro
          </button>
        </div>

        <div style={styles.header}>
          <div style={styles.avatar}>{usuario.nombre[0]}{usuario.apellido[0]}</div>
          <h2 style={{ margin: '10px 0 5px 0' }}>{usuario.nombre} {usuario.apellido}</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Carné: {usuario.registro_academico}</p>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <strong>Correo:</strong>
            <span>{usuario.correo}</span>
          </div>
          <div style={styles.infoItem}>
            <strong>ID Usuario:</strong>
            <span>{usuario.id_usuario}</span>
          </div>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{resumen.total_cursos}</span>
            <span style={styles.statLabel}>Cursos Ganados</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{resumen.total_creditos}</span>
            <span style={styles.statLabel}>Créditos Totales</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', display: 'flex', justifyContent: 'center' },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: '15px', 
    padding: '25px', 
    width: '100%', 
    maxWidth: '450px', 
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)', 
    textAlign: 'center' 
  },
  btnVolver: {
    background: 'none',
    border: 'none',
    color: '#002855',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    padding: '5px 0'
  },
  header: { marginBottom: '20px' },
  avatar: { 
    width: '70px', 
    height: '70px', 
    backgroundColor: '#002855', 
    color: 'white', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '24px', 
    margin: '0 auto', 
    fontWeight: 'bold' 
  },
  infoGrid: { 
    textAlign: 'left', 
    borderTop: '1px solid #f0f0f0', 
    paddingTop: '15px', 
    marginBottom: '20px' 
  },
  infoItem: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    marginBottom: '8px',
    fontSize: '15px' 
  },
  statsContainer: { display: 'flex', gap: '12px' },
  statBox: { 
    backgroundColor: '#FFC107', 
    padding: '12px', 
    borderRadius: '10px', 
    flex: 1 
  },
  statNumber: { display: 'block', fontSize: '22px', fontWeight: 'bold', color: '#002855' },
  statLabel: { fontSize: '10px', fontWeight: 'bold', color: '#002855', textTransform: 'uppercase' }
};

export default PerfilUsuario;