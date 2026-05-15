import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import Login from "./components/login";
import SignUp from "./components/signUp";
import SubirPrueba from "./components/subirPrueba";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/subir" element={<SubirPrueba />} />
      </Routes>
    </Router>
  );
}