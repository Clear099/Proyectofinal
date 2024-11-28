import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SessionDetails.css'; // Importa el archivo CSS
import axios from 'axios';

function SessionDetails() {
  const { session_id: sessionId } = useParams(); // Captura el session_id de la URL
  const navigate = useNavigate(); // Hook para redirigir
  const [sessionDetails, setSessionDetails] = useState([]); // Estado para guardar los detalles
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(false); // Estado de error

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const detailsResponse = await axios.get(`http://localhost:3002/api/session/${sessionId}/details`);
        setSessionDetails(detailsResponse.data);
        setLoading(false); // Finaliza la carga
      } catch (error) {
        console.error('Error fetching session details:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (loading) {
    return <p className="loading-text">Cargando detalles de la sesión...</p>;
  }

  if (error) {
    return <p className="error-text">Hubo un error al cargar los detalles de la sesión. Inténtalo nuevamente.</p>;
  }

  if (!sessionDetails.length) {
    return <p className="no-data-text">No se encontraron detalles para esta sesión.</p>;
  }

  return (
    <div className="container-session-details">
      <h2>Detalles de la Sesión</h2>
      <table>
        <thead>
          <tr>
            <th>Operación</th>
            <th>Pregunta</th>
            <th>Dificultad</th>
            <th>Correcto/Incorrecto</th>
          </tr>
        </thead>
        <tbody>
          {sessionDetails.map((detail, index) => (
            <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
              <td>{detail.operation_type || 'N/A'}</td>
              <td>{detail.operation_question || 'N/A'}</td>
              <td>{detail.difficulty || 'N/A'}</td>
              <td>
                {detail.is_correct ? (
                  <span className="correct">✔️</span>
                ) : (
                  <span className="incorrect">❌</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => navigate(`/session/${sessionId}/charts`)}
        className="button-primary"
      >
        Ver Gráficos
      </button>
    </div>
  );
}

export default SessionDetails;
