// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuth(); // Actualizamos el estado de autenticación

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores anteriores

    try {
      const response = await axios.post('http://localhost:3002/api/login', {
        username,
        password,
      });

      // Si se recibe un token, el usuario está autenticado
      if (response.data.token) {
        setAuth({ token: response.data.token });
        navigate('/student-statistics');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Credenciales incorrectas');
      } else {
        setError('Error de servidor, por favor intenta de nuevo');
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Inicio de Sesión</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Iniciar Sesión
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
