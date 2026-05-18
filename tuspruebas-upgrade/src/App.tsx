import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn } from "./services/Auth";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import Login from "./components/login";
import SignUp from "./components/signUp";
import SubirPrueba from "./components/subirPrueba";
import IA from "./components/Ia";
import AdminPanel from "./components/AdminPanel";
import Perfil from "./components/perfil";

// Ruta protegida — si no está logueado, va al login
function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/subir" element={<PrivateRoute><SubirPrueba /></PrivateRoute>} />
        <Route path="/ia" element={<PrivateRoute><IA /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}