const API_URL = "/api";

export interface User {
  id: number;
  nombre: string;
  email: string;
  avatar?: string;
  rol?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

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

export function isAdmin(): boolean {
  return getUser()?.rol === "admin";
}

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
  const data = await res.json();
  // Backend returns { ok, token, usuario }
  const user: User = data.usuario ?? data.user;
  return { token: data.token, user };
}

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
  // Backend register no devuelve token, hacemos login inmediatamente
  return loginWithEmail(email, password);
}

export function loginWithGoogle() {
  window.location.href = `${API_URL}/auth/google`;
}
