import React, { useState } from 'react';
import Login from './Login';
import PantallaPrincipal from './PantallaPrincipal';
import RecuperarPassword from './RecuperarPassword';

const App = () => {
  const [pantallaActual, setPantallaActual] = useState('login');

  const irAPrincipal = () => setPantallaActual('principal');
  const irALogin = () => setPantallaActual('login');
  const irARecuperar = () => setPantallaActual('recuperar');
  const irARegistro = () => setPantallaActual('registro');

  return (
    <div>
      {pantallaActual === 'login' && (
        <Login 
          irAPrincipal={irAPrincipal} 
          irARecuperar={irARecuperar} 
          irARegistro={irARegistro} 
        />
      )}

      {pantallaActual === 'recuperar' && (
        <RecuperarPassword 
          irALogin={irALogin} 
        />
      )}

      {pantallaActual === 'principal' && (
        <PantallaPrincipal 
          cerrarSesion={irALogin} 
        />
      )}

      {pantallaActual === 'registro' && (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
          <h2>Pantalla de Registro (Próximamente)</h2>
          <button 
            onClick={irALogin} 
            style={{ padding: '10px', cursor: 'pointer' }}
          >
            Volver al Login
          </button>
        </div>
      )}
    </div>
  );
};

export default App;