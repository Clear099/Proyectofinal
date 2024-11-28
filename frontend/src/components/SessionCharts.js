// src/components/SessionCharts.js
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Registrar los componentes necesarios en Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function SessionCharts() {
  const { session_id: sessionId } = useParams();
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/session/${sessionId}/details`);
        setSessionData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener los datos de la sesión:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Cargando gráficos...</p>;
  }

  if (error || !sessionData.length) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>No hay datos disponibles para esta sesión.</p>;
  }

  const correctIncorrectData = {
    correct: sessionData.filter(record => record.is_correct === 1).length,
    incorrect: sessionData.filter(record => record.is_correct === 0).length,
  };

  const operationLabels = [...new Set(sessionData.map(record => record.operation_type))];

  const pieChartData = {
    labels: ['Correctas', 'Incorrectas'],
    datasets: [
      {
        data: [correctIncorrectData.correct, correctIncorrectData.incorrect],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const barChartData = {
    labels: operationLabels,
    datasets: [
      {
        label: 'Respuestas Correctas por Tipo de Operación',
        data: operationLabels.map(
          operation => sessionData.filter(record => record.operation_type === operation && record.is_correct === 1).length
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el gráfico se ajuste al tamaño del contenedor
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px', // Espaciado entre gráficos
    padding: '20px',
  };

  const chartWrapperStyle = {
    width: '90%', // Ajusta el ancho del contenedor
    height: '400px', // Ajusta la altura máxima de los gráficos
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Gráficos de la Sesión</h2>
      <div style={chartWrapperStyle}>
        <h4 style={{ textAlign: 'center' }}>Proporción de Respuestas Correctas vs Incorrectas</h4>
        <Pie data={pieChartData} options={chartOptions} />
      </div>
      <div style={chartWrapperStyle}>
        <h4 style={{ textAlign: 'center' }}>Respuestas Correctas por Tipo de Operación</h4>
        <Bar data={barChartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default SessionCharts;
