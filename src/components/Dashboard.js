import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Box, Typography, LinearProgress, Paper, Grid, Button, Tabs, Tab } from "@mui/material";

function Dashboard({ userId }) {
  const [userData, setUserData] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null); // Materia seleccionada
  const [activeTab, setActiveTab] = useState(0); // Pestaña activa (0: Progreso, 1: Materias)

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };
    fetchUserData();
  }, [userId]);

  // Función de cierre de sesión
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.reload(); // Refresca la página para volver al formulario de login
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error.message);
      });
  };

  if (!userData) {
    return <Typography>Cargando datos...</Typography>;
  }

  // Si se seleccionó una materia, mostrar los temas
  if (selectedSubject) {
    const topics = userData.progress[selectedSubject] || {}; // Obtener temas
    return (
      <Box sx={{ padding: 3 }}>
        <Button variant="contained" onClick={() => setSelectedSubject(null)} sx={{ marginBottom: 2 }}>
          Volver
        </Button>
        <Typography variant="h5" gutterBottom>
          Temas de {selectedSubject}
        </Typography>
        <ul>
          {Object.entries(topics).map(([topic, completed], index) => (
            <li key={index}>
              {topic} - {completed ? "Completado" : "Pendiente"}
            </li>
          ))}
        </ul>
      </Box>
    );
  }

  // Pestaña: Progreso General
  const renderProgressTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Progreso General
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(userData.progress || {}).map(([subject, topics]) => {
          const completed = Object.values(topics).filter((done) => done).length;
          const total = Object.keys(topics).length;
          const progress = (completed / total) * 100;

          return (
            <Grid item xs={12} sm={6} md={4} key={subject}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="subtitle1">{subject}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ marginY: 1 }} />
                <Typography variant="body2">
                  {completed}/{total} temas completados
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setSelectedSubject(subject)} // Seleccionar materia
                  sx={{ marginTop: 1 }}
                >
                  Ver temas
                </Button>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  // Pestaña: Materias
  const renderSubjectsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Materias Disponibles
      </Typography>
      <ul>
        {Object.keys(userData.progress || {}).map((subject, index) => (
          <li key={index}>
            <Button variant="text" onClick={() => setSelectedSubject(subject)}>
              {subject}
            </Button>
          </li>
        ))}
      </ul>
    </Box>
  );

  return (
    <Box sx={{ padding: 3 }}>
      {/* Saludo */}
      <Typography variant="h4" gutterBottom>
        Hola, {userData.name}
      </Typography>

      {/* Pestañas */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ marginBottom: 3 }}
      >
        <Tab label="Progreso General" />
        <Tab label="Materias" />
      </Tabs>

      {/* Contenido de las pestañas */}
      {activeTab === 0 && renderProgressTab()}
      {activeTab === 1 && renderSubjectsTab()}

      {/* Botón de Cerrar Sesión */}
      <Button
        onClick={handleLogout}
        variant="contained"
        color="error"
        sx={{ marginTop: 3 }}
      >
        Cerrar Sesión
      </Button>
    </Box>
  );
}

export default Dashboard;
