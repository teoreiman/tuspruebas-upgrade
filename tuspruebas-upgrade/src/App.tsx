import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import Login from "./components/login";
import SignUp from "./components/signUp";
import SubirPrueba from "./components/subirPrueba";
import IA from "./components/Ia";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/subir" element={<SubirPrueba />} />
        <Route path="/ia" element={<IA />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}