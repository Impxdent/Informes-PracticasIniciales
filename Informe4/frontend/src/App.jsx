import React, { useState } from 'react';
import Login from './Login';
import Registro from './Registro';
import PantallaPrincipal from './PantallaPrincipal';

function App() {
  const [vistaActual, setVistaActual] = useState('login');

  return (
    <div>
      {vistaActual === 'login' && <Login 
        irARegistro={() => setVistaActual('registro')}
        irAPrincipal={() => setVistaActual('principal')} />}
      {vistaActual === 'registro' && <Registro irALogin={() => setVistaActual('login')} />}
      {vistaActual === 'principal' && <PantallaPrincipal cerrarSesion={() => setVistaActual('login')} />}
    </div>
  );
}

export default App;