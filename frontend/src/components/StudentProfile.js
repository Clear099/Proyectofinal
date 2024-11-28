import React, { useEffect, useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function StudentProfile() {
  const { id: studentId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentSummary, setStudentSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Obtener sesiones agrupadas
        const sessionResponse = await axios.get(`http://localhost:3002/api/student/${studentId}/sessions`);
        setSessions(sessionResponse.data);

        // Obtener nombre del estudiante
        const userResponse = await axios.get(`http://localhost:3002/api/student/${studentId}`);
        setStudentName(userResponse.data.username || 'Estudiante');

        // Obtener resumen general del estudiante
        const summaryResponse = await axios.get(`http://localhost:3002/api/student/${studentId}/summary`);
        setStudentSummary(summaryResponse.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  // Función para formatear fecha y hora
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <Container>
      <h2 className="text-center mt-4">Perfil del Usuario: {studentName}</h2>
      {studentSummary ? (
        <div className="mb-4">
          <h5>Resumen del Estudiante</h5>
          <p><strong>Puntaje Promedio:</strong> {studentSummary.averageScore ? studentSummary.averageScore.toFixed(2) : 'N/A'}</p>
        </div>
      ) : (
        <p>Cargando resumen del estudiante...</p>
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Sesión ID</th>
            <th>Puntaje Máximo</th>
            <th>Interacciones Totales</th>
            <th>Fecha y Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={index}>
              <td>{session.session_id}</td>
              <td>{session.max_score || 0}</td>
              <td>{session.total_interactions || 0}</td>
              <td>{session.first_timestamp ? formatTimestamp(session.first_timestamp) : 'N/A'}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => navigate(`/session/${session.session_id}/details`)}
                >
                  Ver Detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="primary"
        className="mt-3"
        onClick={() => navigate(`/student/${studentId}/charts`)}
      >
        Estadísticas Acumuladas
      </Button>
    </Container>
  );
}

export default StudentProfile;
