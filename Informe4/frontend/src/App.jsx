import React, { useState } from 'react';
import Login from './Login';
import PantallaPrincipal from './PantallaPrincipal';
import RecuperarPassword from './RecuperarPassword';
import CursosAprobados from './CursosAprobados';
import PerfilUsuario from './PerfilUsuario';
import Registro from './Registro';

const App = () => {
  const [pantallaActual, setPantallaActual] = useState('login');

  // Funciones de navegación
  const irAPrincipal = () => setPantallaActual('principal');
  const irALogin = () => {
    localStorage.removeItem('usuarioActivo'); // Limpia sesión al salir
    setPantallaActual('login');
  };
  const irARecuperar = () => setPantallaActual('recuperar');
  const irARegistro = () => setPantallaActual('registro');
  const irACursos = () => setPantallaActual('cursos');
  const irAPerfil = () => setPantallaActual('perfil');

  const mostrarNav = ['principal', 'cursos', 'perfil'].includes(pantallaActual);

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      {mostrarNav && (
        <nav style={styles.nav}>
          <button 
            onClick={irAPrincipal} 
            style={pantallaActual === 'principal' ? styles.btnActive : styles.btnNav}
          >
            Foro / Publicaciones
          </button>
          <button 
            onClick={irACursos} 
            style={pantallaActual === 'cursos' ? styles.btnActive : styles.btnNav}
          >
            Mis Cursos Aprobados
          </button>
          <button 
            onClick={irAPerfil} 
            style={pantallaActual === 'perfil' ? styles.btnActive : styles.btnNav}
          >
            Mi Perfil
          </button>
          <button onClick={irALogin} style={styles.btnSalirNav}>
            Salir
          </button>
        </nav>
      )}

      <main style={styles.mainContent}>
        
        {pantallaActual === 'login' && (
          <Login irAPrincipal={irAPrincipal} irARecuperar={irARecuperar} irARegistro={irARegistro} />
        )}
        
        {pantallaActual === 'registro' && (
          <Registro irALogin={irALogin} /> 
        )}

        {pantallaActual === 'recuperar' && (
          <RecuperarPassword irALogin={irALogin} />
        )}

        {pantallaActual === 'principal' && (
          <PantallaPrincipal cerrarSesion={irALogin} />
        )}

        {pantallaActual === 'perfil' && (
          <PerfilUsuario irAForo={irAPrincipal} />
        )}

        {pantallaActual === 'cursos' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <CursosAprobados />
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  nav: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    gap: '15px', 
    padding: '15px 20px', 
    backgroundColor: '#002855', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  btnNav: { 
    padding: '10px 18px', 
    backgroundColor: 'transparent', 
    color: 'white', 
    border: '1px solid rgba(255,255,255,0.3)', 
    borderRadius: '6px', 
    cursor: 'pointer',
    fontWeight: '500',
    transition: '0.3s'
  },
  btnActive: { 
    padding: '10px 18px', 
    backgroundColor: '#FFC107', 
    color: '#002855', 
    border: '1px solid #FFC107', 
    borderRadius: '6px', 
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  btnSalirNav: {
    padding: '10px 18px',
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: 'auto' 
  },
  mainContent: {
    padding: '20px',
    minHeight: 'calc(100vh - 80px)'
  }
};

export default App;