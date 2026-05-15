// ── API base URL ──────────────────────────────────────────────────────────────
// Manu: cambiá esto cuando el backend esté deployado
const API_URL = "http://localhost:3000";

export interface User {
  id: number;
  nombre: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ── Guardar / leer sesión ────────────────────────────────────────────────────
export function saveSession(token: string, user: User) {
  localStorage.setItem("tp_token", token);
  localStorage.setItem("tp_user", JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem("tp_token");
}

export function getUser(): User | null {
  const raw = localStorage.getItem("tp_user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearSession() {
  localStorage.removeItem("tp_token");
  localStorage.removeItem("tp_user");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ── Login con email / password ───────────────────────────────────────────────
export async function loginWithEmail(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al iniciar sesión" }));
    throw new Error(err.message ?? "Credenciales incorrectas");
  }

  return res.json();
}

// ── Registro ─────────────────────────────────────────────────────────────────
export async function registerUser(nombre: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al registrarse" }));
    throw new Error(err.message ?? "No se pudo crear la cuenta");
  }

  return res.json();
}

// ── Google OAuth ─────────────────────────────────────────────────────────────
export function loginWithGoogle() {
  window.location.href = `${API_URL}/auth/google`;
}