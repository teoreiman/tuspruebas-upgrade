import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 font-dm-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-12">
          <motion.button onClick={() => navigate("/")} className="text-gray-900 font-black text-2xl font-syne inline-block mb-2">
            tuspruebas
          </motion.button>
          <p className="text-gray-600 text-sm">Iniciá sesión para continuar</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-sm text-gray-700 font-semibold block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-400 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-semibold block mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-400 transition-colors"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors mt-2"
            >
              Iniciar sesión
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            ¿No tenés cuenta?{" "}
            <motion.button
              onClick={() => navigate("/signup")}
              className="text-gray-900 font-bold hover:underline transition-colors"
            >
              Registrate
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}