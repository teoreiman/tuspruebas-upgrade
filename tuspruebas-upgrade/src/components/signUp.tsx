import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: conectar con backend
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-tp-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <button onClick={() => navigate("/")} className="text-tp-yellow font-black text-2xl tracking-tight">
            tus<span className="text-white">Pruebas</span>
          </button>
          <p className="text-tp-gray mt-2 text-sm">Creá tu cuenta gratis</p>
        </div>

        {/* Card */}
        <div className="bg-tp-card border border-white/8 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-white/70 font-medium">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
                className="bg-tp-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-tp-yellow/50 transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-white/70 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tumail@ejemplo.com"
                required
                className="bg-tp-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-tp-yellow/50 transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-white/70 font-medium">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-tp-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-tp-yellow/50 transition-colors duration-200"
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-tp-yellow text-tp-bg font-black py-3 rounded-xl hover:bg-yellow-300 transition-colors duration-200"
            >
              Crear cuenta
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-tp-gray text-sm">¿Ya tenés cuenta? </span>
            <button
              onClick={() => navigate("/login")}
              className="text-tp-yellow text-sm font-semibold hover:underline"
            >
              Iniciá sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}