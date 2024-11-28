// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { auth } = useAuth();

  if (!auth || !auth.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
