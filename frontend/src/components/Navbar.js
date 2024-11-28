// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../AuthContext';

function CustomNavbar() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null); // Elimina el token del estado de autenticación
    navigate('/login'); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">Vista Profesor</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/login">Login</Nav.Link>

          {auth && auth.token && (
            <>
              <Nav.Link as={Link} to="/register">Registro</Nav.Link>
              <Nav.Link as={Link} to="/student-statistics">Alumnos</Nav.Link>
              <Button variant="outline-danger" onClick={handleLogout} className="ms-2">
                Cerrar Sesión
              </Button>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
