const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tesis',
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// ================================
// Gestión de usuarios y autenticación
// ================================

// Registro de un nuevo profesor
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  console.log('Solicitud de registro recibida:', req.body);

  if (!username || !password || !email) {
    console.log('Campos obligatorios faltantes en la solicitud de registro');
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const query = 'INSERT INTO profesores (username, password, email) VALUES (?, ?, ?)';

  db.query(query, [username, hashedPassword, email], (err) => {
    if (err) {
      console.error('Error al registrar profesor:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Este nombre de usuario o correo ya está en uso.' });
      }
      return res.status(500).json({ error: err.message });
    }
    console.log(`Profesor registrado exitosamente: ${username}`);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  });
});

// Inicio de sesión de profesor y generación de token JWT
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Solicitud de inicio de sesión recibida:', req.body);

  if (!username || !password) {
    console.log('Campos obligatorios faltantes en la solicitud de inicio de sesión');
    return res.status(400).json({ message: 'Se requiere nombre de usuario y contraseña.' });
  }

  const query = 'SELECT * FROM profesores WHERE username = ?';

  db.query(query, [username], (err, result) => {
    if (err) {
      console.error('Error al buscar el profesor:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (result.length === 0) {
      console.log(`Usuario no encontrado: ${username}`);
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const profesor = result[0];
    const passwordIsValid = bcrypt.compareSync(password, profesor.password);
    if (!passwordIsValid) {
      console.log(`Contraseña incorrecta para el usuario: ${username}`);
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: profesor.id }, 'clave_secreta', { expiresIn: '1h' });
    console.log(`Inicio de sesión exitoso para el usuario: ${username}`);
    res.json({ token });
  });
});

// ================================
// Gestión de estadísticas de estudiantes
// ================================

// Obtener todos los estudiantes y sus mejores puntajes
app.get('/api/student-scores', (req, res) => {
  console.log('Solicitud para obtener todos los estudiantes y sus mejores puntajes');

  const query = `
    SELECT u.id, u.username, MAX(s.score) AS bestScore
    FROM users u
    LEFT JOIN scores s ON u.id = s.user_id
    GROUP BY u.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener estadísticas de estudiantes:', err);
      return res.status(500).json({ error: 'Error al obtener estadísticas de estudiantes' });
    }
    console.log('Estadísticas de estudiantes obtenidas:', results);
    res.json(results);
  });
});

// Obtener resumen y sesiones de un estudiante específico
app.get('/api/student/:id/summary', (req, res) => {
  const studentId = req.params.id;
  console.log(`Solicitud recibida para obtener resumen de estudiante: ${studentId}`);

  const summaryQuery = `
    SELECT 
      COUNT(*) AS gamesPlayed, 
      AVG(score) AS averageScore
    FROM game_records
    WHERE user_id = ?;
  `;

  db.query(summaryQuery, [studentId], (err, summaryResult) => {
    if (err) {
      console.error('Error al obtener el resumen del estudiante:', err);
      return res.status(500).json({ error: 'Error al obtener el resumen del estudiante.' });
    }
    console.log(`Resumen obtenido para estudiante ${studentId}:`, summaryResult);
    res.json(summaryResult[0] || { gamesPlayed: 0, averageScore: 0 });
  });
});

// Obtener todas las sesiones de un estudiante agrupadas por session_id
app.get('/api/student/:id/sessions', (req, res) => {
  const studentId = req.params.id;
  console.log(`Solicitud recibida para obtener sesiones del estudiante: ${studentId}`);

  const query = `
  SELECT 
    session_id,
    MAX(score) AS max_score,
    COUNT(*) AS total_interactions,
    MIN(timestamp) AS first_timestamp
  FROM game_records
  WHERE user_id = ?
  GROUP BY session_id
  ORDER BY first_timestamp DESC;
`;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error al obtener sesiones:', err);
      return res.status(500).json({ error: 'Error al obtener sesiones.' });
    }
    console.log(`Sesiones obtenidas para estudiante ${studentId}:`, results);
    res.json(results || []);
  });
});

// Obtener detalles específicos de una sesión
app.get('/api/session/:session_id/details', (req, res) => {
  const sessionId = req.params.session_id;
  console.log(`Solicitud recibida para session_id: ${sessionId}`);

  const query = `
    SELECT 
      operation_type,
      operation_question,
      difficulty,
      is_correct
    FROM game_records
    WHERE session_id = ?
    ORDER BY id;
  `;

  db.query(query, [sessionId], (err, results) => {
    if (err) {
      console.error('Error al obtener detalles de la sesión:', err);
      return res.status(500).json({ error: 'Error al obtener detalles de la sesión.' });
    }
    console.log(`Datos obtenidos para session_id ${sessionId}:`, results);
    res.json(results || []);
  });
});

// Obtener nombre de un estudiante
app.get('/api/student/:id', (req, res) => {
  const studentId = req.params.id;
  console.log(`Solicitud recibida para obtener el nombre del estudiante: ${studentId}`);

  const query = `
    SELECT username 
    FROM users 
    WHERE id = ?;
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error al obtener el nombre del estudiante:', err);
      return res.status(500).json({ error: 'Error al obtener el nombre del estudiante.' });
    }
    if (results.length === 0) {
      console.log(`Estudiante no encontrado con ID: ${studentId}`);
      return res.status(404).json({ message: 'Estudiante no encontrado.' });
    }
    console.log(`Nombre del estudiante obtenido: ${results[0].username}`);
    res.json(results[0]);
  });
});


// Endpoint para estadísticas del dashboard
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const totalStudentsQuery = 'SELECT COUNT(*) AS totalStudents FROM users';
    const totalSessionsQuery = 'SELECT COUNT(DISTINCT session_id) AS totalSessions FROM game_records';
    const averageScoreQuery = 'SELECT AVG(score) AS averageScore FROM game_records';
    const correctAnswersQuery = 'SELECT COUNT(*) AS correctAnswers FROM game_records WHERE is_correct = 1';
    const incorrectAnswersQuery = 'SELECT COUNT(*) AS incorrectAnswers FROM game_records WHERE is_correct = 0';

    const stats = {};

    db.query(totalStudentsQuery, (err, result) => {
      if (err) throw err;
      stats.totalStudents = result[0].totalStudents;

      db.query(totalSessionsQuery, (err, result) => {
        if (err) throw err;
        stats.totalSessions = result[0].totalSessions;

        db.query(averageScoreQuery, (err, result) => {
          if (err) throw err;
          stats.averageScore = result[0].averageScore || 0;

          db.query(correctAnswersQuery, (err, result) => {
            if (err) throw err;
            stats.correctAnswers = result[0].correctAnswers;

            db.query(incorrectAnswersQuery, (err, result) => {
              if (err) throw err;
              stats.incorrectAnswers = result[0].incorrectAnswers;

              res.json(stats);
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
});

app.get('/api/student/:id/correct-incorrect', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT 
      SUM(correct_answers) AS correct, 
      SUM(incorrect_answers) AS incorrect
    FROM game_records
    WHERE user_id = ?;
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching correct/incorrect data:', err);
      return res.status(500).json({ error: 'Error fetching data.' });
    }
    res.json(results[0] || { correct: 0, incorrect: 0 });
  });
});


app.get('/api/student/:id/operations', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT 
      operation_type, 
      SUM(correct_answers) AS total_correct, 
      SUM(incorrect_answers) AS total_incorrect
    FROM game_records
    WHERE user_id = ?
    GROUP BY operation_type;
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching operations data:', err);
      return res.status(500).json({ error: 'Error fetching data.' });
    }
    res.json(results);
  });
});


app.get('/api/student/:id/progress', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT 
      session_id, 
      AVG(score) AS average_score, 
      MIN(timestamp) AS session_date
    FROM game_records
    WHERE user_id = ?
    GROUP BY session_id
    ORDER BY MIN(timestamp);
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching progress data:', err);
      return res.status(500).json({ error: 'Error fetching data.' });
    }
    res.json(results);
  });
});



// ================================
// Iniciar servidor
// ================================

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
