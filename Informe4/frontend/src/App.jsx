import React, { useState } from 'react';
import Login from './Login';
import Registro from './Registro';

function App() {
  const [vistaActual, setVistaActual] = useState('login');

  return (
    <div>
      {vistaActual === 'login' && <Login irARegistro={() => setVistaActual('registro')} />}
      {vistaActual === 'registro' && <Registro irALogin={() => setVistaActual('login')} />}
    </div>
  );
}

export default App;