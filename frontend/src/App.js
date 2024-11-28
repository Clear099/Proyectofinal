// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentStatistics from './components/StudentStatistics';
import StudentCharts from './components/StudentCharts';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard'; // Importar el nuevo componente Dashboard
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import StudentProfile from './components/StudentProfile';
import SessionDetails from './components/SessionDetails';
import SessionCharts from './components/SessionCharts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-statistics"
              element={
                <ProtectedRoute>
                  <StudentStatistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-charts"
              element={
                <ProtectedRoute>
                  <StudentCharts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/:id/profile"
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/session/:session_id/details"
              element={
                <ProtectedRoute>
                  <SessionDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/session/:session_id/charts"
              element={
                <ProtectedRoute>
                  <SessionCharts />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
