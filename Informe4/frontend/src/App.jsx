import React, { useState } from 'react';
import Login from './Login';
import PantallaPrincipal from './PantallaPrincipal';
import RecuperarPassword from './RecuperarPassword';
import CursosAprobados from './CursosAprobados';
import PerfilUsuario from './PerfilUsuario';

const App = () => {
  const [pantallaActual, setPantallaActual] = useState('login');

  const irAPrincipal = () => setPantallaActual('principal');
  const irALogin = () => setPantallaActual('login');
  const irARecuperar = () => setPantallaActual('recuperar');
  const irARegistro = () => setPantallaActual('registro');
  const irACursos = () => setPantallaActual('cursos');
  const irAPerfil = () => setPantallaActual('perfil');

  return (
    <div>
      {(pantallaActual === 'principal' || pantallaActual === 'cursos') && (
        <nav style={styles.nav}>
          <button onClick={irAPrincipal} style={pantallaActual === 'principal' ? styles.btnActive : styles.btnNav}>Foro / Publicaciones</button>
          <button onClick={irACursos} style={pantallaActual === 'cursos' ? styles.btnActive : styles.btnNav}>Mis Cursos Aprobados</button>
          <button onClick={irAPerfil} style={pantallaActual === 'perfil' ? styles.btnActive : styles.btnNav}>Mi Perfil</button>
        </nav>
      )}

      {pantallaActual === 'login' && (
        <Login irAPrincipal={irAPrincipal} irARecuperar={irARecuperar} irARegistro={irARegistro} />
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
        <div style={{ maxWidth: '800px', margin: '20px auto' }}>
          <CursosAprobados />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={irALogin} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}>Cerrar Sesión</button>
          </div>
        </div>
      )}

      {pantallaActual === 'registro' && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Pantalla de Registro (Próximamente)</h2>
          <button onClick={irALogin}>Volver al Login</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  nav: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '10px', 
    padding: '15px', 
    backgroundColor: '#002855', 
    marginBottom: '20px' 
  },
  btnNav: { 
    padding: '10px 20px', 
    backgroundColor: 'white', 
    color: '#002855', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  btnActive: { 
    padding: '10px 20px', 
    backgroundColor: '#FFC107', 
    color: 'black', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default App;