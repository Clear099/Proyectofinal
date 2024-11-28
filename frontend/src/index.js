// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Usar ReactDOM Client para React 18+
import App from './App';
import { AuthProvider } from './AuthContext';
import './index.css'; // Asegúrate de tener un archivo CSS global
import 'bootstrap/dist/css/bootstrap.min.css'; // Elimina esto si usas solo Material UI

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
