import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// --- CAMBIO CLAVE ---
// Hemos eliminado las etiquetas <React.StrictMode> que envolvían a <App />
root.render(
  <App />
);
// --- FIN DEL CAMBIO CLAVE ---