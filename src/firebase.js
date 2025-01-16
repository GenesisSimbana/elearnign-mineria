import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importa auth

const firebaseConfig = {
  apiKey: "AIzaSyBGBfAypTENdNrHjwnI_Gt1cUnsC6DQFKg",
  authDomain: "e-learningespe.firebaseapp.com",
  projectId: "e-learningespe",
  storageBucket: "e-learningespe.firebasestorage.app",
  messagingSenderId: "306177092803",
  appId: "1:306177092803:web:9916ba0a9ba9f0b37dc676",
  measurementId: "G-2E9CZ2JZXR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Esta línea es opcional si no la necesitas
const db = getFirestore(app); // Correcto, Firestore está configurado
const auth = getAuth(app); // Obtener la instancia de auth

export { db, auth }; // Exporta auth además de db
export default app; // Exportas la instancia principal de app si la necesitas
