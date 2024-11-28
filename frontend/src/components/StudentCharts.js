import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';

// Registrar los componentes necesarios en Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, ArcElement);

function StudentCharts({ studentId }) {
  const [correctIncorrectData, setCorrectIncorrectData] = useState({ correct: 0, incorrect: 0 });
  const [operationData, setOperationData] = useState([]);
  const [sessionProgress, setSessionProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Correctas e incorrectas acumuladas
        const correctIncorrectResponse = await axios.get(`http://localhost:3002/api/student/${studentId}/correct-incorrect`);
        setCorrectIncorrectData(correctIncorrectResponse.data);

        // Respuestas por operación y dificultad
        const operationResponse = await axios.get(`http://localhost:3002/api/student/${studentId}/operations`);
        setOperationData(operationResponse.data);

        // Evolución del puntaje promedio por sesión
        const sessionProgressResponse = await axios.get(`http://localhost:3002/api/student/${studentId}/progress`);
        setSessionProgress(sessionProgressResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [studentId]);

  // Gráfico de pastel: Correctas vs Incorrectas
  const pieChartData = {
    labels: ['Correctas', 'Incorrectas'],
    datasets: [
      {
        data: [correctIncorrectData.correct, correctIncorrectData.incorrect],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  // Gráfico de barras: Respuestas correctas por operación
  const barChartData = {
    labels: [...new Set(operationData.map(record => record.operation_type))],
    datasets: [
      {
        label: 'Correctas',
        data: operationData.map(record => record.total_correct),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Incorrectas',
        data: operationData.map(record => record.total_incorrect),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Gráfico de líneas: Puntaje promedio por sesión
  const lineChartData = {
    labels: sessionProgress.map(record => new Date(record.session_date).toLocaleDateString()),
    datasets: [
      {
        label: 'Puntaje Promedio',
        data: sessionProgress.map(record => record.average_score),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Estadísticas del Estudiante</h2>

      {/* Gráfico de pastel */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Proporción de Respuestas Correctas vs Incorrectas</h4>
        <Pie data={pieChartData} options={{ responsive: true }} />
      </div>

      {/* Gráfico de barras */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Respuestas Correctas e Incorrectas por Tipo de Operación</h4>
        <Bar data={barChartData} options={{ responsive: true }} />
      </div>

      {/* Gráfico de líneas */}
      <div>
        <h4>Evolución del Puntaje Promedio por Sesión</h4>
        <Line data={lineChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
}

export default StudentCharts;
