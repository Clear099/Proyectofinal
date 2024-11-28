// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSessions: 0,
    averageScore: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const pieChartData = {
    labels: ['Correctas', 'Incorrectas'],
    datasets: [
      {
        data: [stats.correctAnswers, stats.incorrectAnswers],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Principal
      </Typography>
      <Grid container spacing={3}>
        {/* Resumen de estadísticas */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total de Estudiantes</Typography>
            <Typography variant="h4">{stats.totalStudents}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6">Sesiones Completadas</Typography>
            <Typography variant="h4">{stats.totalSessions}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6">Puntaje Promedio</Typography>
            <Typography variant="h4">{stats.averageScore.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        {/* Gráfico */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
              Respuestas Correctas vs Incorrectas
            </Typography>
            <Pie data={pieChartData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
