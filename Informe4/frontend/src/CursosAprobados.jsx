import React, { useState, useEffect } from 'react';

const CursosAprobados = () => {
  const [todosLosCursos, setTodosLosCursos] = useState([]);
  const [misAprobados, setMisAprobados] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  
  // Obtenemos el usuario del localStorage
  const usuarioRaw = localStorage.getItem('usuarioActivo');
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;

  const cargarDatos = async () => {
    try {
      // 1. Cargar catálogo de cursos
      const res1 = await fetch('http://localhost:3001/api/cursos');
      if (res1.ok) {
        const data1 = await res1.json();
        console.log("Catálogo de cursos cargado:", data1); // Verifica esto en F12
        setTodosLosCursos(data1);
      }

      // 2. Cargar cursos aprobados por este usuario
      if (usuario && usuario.id_usuario) {
        const res2 = await fetch(`http://localhost:3001/api/mis-cursos/${usuario.id_usuario}`);
        if (res2.ok) {
          const data2 = await res2.json();
          console.log("Mis cursos aprobados:", data2);
          setMisAprobados(data2);
        }
      }
    } catch (e) {
      console.error("Error al cargar datos:", e);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const aprobarCurso = async () => {
    if (!cursoSeleccionado) {
      alert("Por favor, selecciona un curso");
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/cursos-aprobados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_usuario: usuario.id_usuario, 
          id_curso: cursoSeleccionado 
        })
      });

      if (res.ok) {
        alert("¡Curso marcado como ganado!");
        setCursoSeleccionado(''); // Resetear selector
        cargarDatos(); // Recargar tablas
      } else {
        const errorData = await res.json();
        alert("Error: " + (errorData.error || "No se pudo registrar"));
      }
    } catch (e) {
      console.error("Error al aprobar curso:", e);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#002855', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          Gestión de Cursos Aprobados
        </h3>
        
        {/* Sección de Selección */}
        <div style={{ display: 'flex', gap: '10px', margin: '20px 0', alignItems: 'center' }}>
          <select 
            value={cursoSeleccionado}
            onChange={(e) => setCursoSeleccionado(e.target.value)} 
            style={{ padding: '12px', borderRadius: '6px', flex: 1, border: '1px solid #ccc' }}
          >
            <option value="">-- Selecciona un curso para aprobar --</option>
            {todosLosCursos.length > 0 ? (
              todosLosCursos.map(c => (
                <option key={c.id_curso} value={c.id_curso}>
                  {c.nombre_curso} ({c.id_curso})
                </option>
              ))
            ) : (
              <option disabled>No hay cursos disponibles en la base de datos</option>
            )}
          </select>

          <button 
            onClick={aprobarCurso} 
            style={{ 
              padding: '12px 20px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Marcar como ganado
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#002855', color: 'white' }}>
              <th style={styles.th}>Curso</th>
              <th style={styles.th}>Créditos</th>
              <th style={styles.th}>Fecha Aprobación</th>
            </tr>
          </thead>
          <tbody>
            {misAprobados.length > 0 ? (
              misAprobados.map(m => (
                <tr key={m.id_registro} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={styles.td}>{m.nombre_curso}</td>
                  <td style={styles.td}>{m.creditos}</td>
                  <td style={styles.td}>{new Date(m.fecha_aprobacion).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  Aún no tienes cursos registrados como aprobados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  th: { padding: '12px', textAlign: 'center' },
  td: { padding: '12px', textAlign: 'center' }
};

export default CursosAprobados;