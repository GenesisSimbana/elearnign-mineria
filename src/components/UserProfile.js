import React, { useState, useEffect } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null);

  // Obtener datos del usuario
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

  // Actualizar progreso del usuario
  const updateProgress = async (course, newProgress) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        [`progress.${course}`]: newProgress
      });

      // Actualizar el estado local
      setUserData((prevData) => ({
        ...prevData,
        progress: {
          ...prevData.progress,
          [course]: newProgress
        }
      }));
    } catch (error) {
      console.error("Error al actualizar progreso:", error.message);
    }
  };

  // Simular recomendaciones basadas en preferencias
  const simulateRecommendations = (preferences) => {
    const allCourses = [
      { id: "course1", name: "Matemáticas Avanzadas", tags: ["mathematics"] },
      { id: "course2", name: "Inteligencia Artificial", tags: ["AI"] },
      { id: "course3", name: "Historia Mundial", tags: ["history"] },
      { id: "course4", name: "Programación en Python", tags: ["programming"] }
    ];

    return allCourses.filter((course) =>
      course.tags.some((tag) => preferences.includes(tag))
    );
  };

  const recommendations = userData ? simulateRecommendations(userData.preferences) : [];

  return (
    <div>
      {userData ? (
        <div>
          <h1>Bienvenido, {userData.name}</h1>
          <h2>Progreso:</h2>
          <ul>
            {Object.entries(userData.progress).map(([course, progress]) => (
              <li key={course}>
                {course}: {progress}%
                <button onClick={() => updateProgress(course, progress + 10)}>
                  Incrementar progreso
                </button>
              </li>
            ))}
          </ul>

          <h2>Recomendaciones:</h2>
          <ul>
            {recommendations.map((course) => (
              <li key={course.id}>{course.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default UserProfile;
