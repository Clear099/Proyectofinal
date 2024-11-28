import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function StudentStatistics() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentScores = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/student-scores');
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student scores:', error);
        setLoading(false);
      }
    };

    fetchStudentScores();
  }, []);

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <Container>
      <h2 className="text-center mt-4">Alumnos</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre del Estudiante</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.username}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => navigate(`/student/${student.id}/profile`)}
                >
                  Ver Perfil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default StudentStatistics;
