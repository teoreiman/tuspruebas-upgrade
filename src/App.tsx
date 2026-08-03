import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn, isSuperAdmin } from "./services/Auth";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import Login from "./components/login";
import SignUp from "./components/signUp";
import SubirPrueba from "./components/subirPrueba";
import DetallePrueba from "./components/DetallePrueba";
import Favoritas from "./components/Favoritas";
import MisPruebas from "./components/MisPruebas";
import IA from "./components/Ia";
import AdminPanel from "./components/AdminPanel";
import Perfil from "./components/perfil";
import AuthCallback from "./components/AuthCallback";
import ErrorBoundary from "./components/ErrorBoundary";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!isSuperAdmin()) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/"              element={<LandingPage />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/signup"        element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/home"          element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/prueba/:id"    element={<PrivateRoute><DetallePrueba /></PrivateRoute>} />
          <Route path="/favoritas"     element={<PrivateRoute><Favoritas /></PrivateRoute>} />
          <Route path="/mis-pruebas"   element={<PrivateRoute><MisPruebas /></PrivateRoute>} />
          <Route path="/subir"         element={<PrivateRoute><SubirPrueba /></PrivateRoute>} />
          <Route path="/ia"            element={<PrivateRoute><IA /></PrivateRoute>} />
          <Route path="/perfil"        element={<PrivateRoute><Perfil /></PrivateRoute>} />
          <Route path="/admin"         element={<AdminRoute><AdminPanel /></AdminRoute>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
