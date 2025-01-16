// Navigation.js
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Asegúrate de importar auth también

const handleLogout = () => {
  signOut(auth)
    .then(() => {
      window.location.reload(); // Refresca la página para volver al formulario de login
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error.message);
    });
};

function Navigation() {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/subjects">Materias</Link> |{" "}
    </nav>
  );
}

export default Navigation;
