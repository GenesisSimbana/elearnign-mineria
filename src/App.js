import './App.css';
import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import Dashboard from "./components/Dashboard";
import Subjects from "./components/Subjects";
import Content from "./components/Content";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

// Componente principal
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return unsubscribe;
  }, [auth]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        email: user.email,
        name: "Nombre del usuario",
        progress: {},
        preferences: []
      });

      setUserId(user.uid);
    } catch (error) {
      alert("Error al registrarse: " + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUserId(user.uid);
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Ruta para Login */}
        <Route
          path="/"
          element={
            userId ? (
              <Navigate to="/dashboard" />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "100vh",
                  padding: 2,
                  background: "#f5f5f5"
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: 4,
                    maxWidth: 400,
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  <Typography variant="h2" sx={{ textAlign: "center", marginTop: 4 }}>
                    E-LEARNING ESPE 2025
                  </Typography>
                  
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    {isLogin ? "Iniciar Sesión" : "Registro"}
                  </Typography>
                  <form onSubmit={isLogin ? handleLogin : handleSignUp}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Correo electrónico"
                      variant="outlined"
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      type="password"
                      label="Contraseña"
                      variant="outlined"
                      margin="normal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 2 }}
                    >
                      {isLogin ? "Iniciar Sesión" : "Registrar"}
                    </Button>
                  </form>
                  <Typography sx={{ marginTop: 2 }}>
                    {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                    <Button onClick={() => setIsLogin(!isLogin)}>
                      {isLogin ? "Regístrate" : "Inicia sesión"}
                    </Button>
                  </Typography>
                </Paper>
              </Box>
            )
          }
        />

        {/* Ruta para Dashboard */}
        <Route
          path="/dashboard"
          element={userId ? <Dashboard userId={userId} /> : <Navigate to="/" />}
        />

        {/* Ruta para asignaturas */}
        <Route
          path="/subjects"
          element={userId ? <Subjects /> : <Navigate to="/" />}
        />

        {/* Ruta para contenido de una asignatura */}
        <Route
          path="/content/:subjectId"
          element={userId ? <Content /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
