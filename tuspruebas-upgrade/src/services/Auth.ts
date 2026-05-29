const API_URL = "http://localhost:3000/api";
// ── Cuando sea true, usa cuentas locales sin backend ─────────────────────────
// Manu: cambiar a false cuando el backend esté listo
const USE_MOCK = false;

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

// ── Cuentas mock de prueba ────────────────────────────────────────────────────
const MOCK_USERS: { email: string; password: string; user: User }[] = [
  { email: "teo@tuspruebas.com",  password: "123456", user: { id: 1, nombre: "Teo Reiman",   email: "teo@tuspruebas.com"  } },
  { email: "fede@tuspruebas.com", password: "123456", user: { id: 2, nombre: "Fede Hanono",  email: "fede@tuspruebas.com" } },
  { email: "manu@tuspruebas.com", password: "123456", user: { id: 3, nombre: "Manu Szwarc",  email: "manu@tuspruebas.com" } },
  { email: "admin@tuspruebas.com",password: "admin123",user:{ id: 0, nombre: "Admin",        email: "admin@tuspruebas.com"} },
];

// ── Persistencia ──────────────────────────────────────────────────────────────
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

// ── Login ─────────────────────────────────────────────────────────────────────
export async function loginWithEmail(email: string, password: string): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Email o contraseña incorrectos");
    return { token: `mock_token_${found.user.id}`, user: found.user };
  }

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

// ── Registro ──────────────────────────────────────────────────────────────────
export async function registerUser(nombre: string, email: string, password: string): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    const exists = MOCK_USERS.find((u) => u.email === email);
    if (exists) throw new Error("Ya existe una cuenta con ese email");
    const newUser: User = { id: Date.now(), nombre, email };
    return { token: `mock_token_${newUser.id}`, user: newUser };
  }

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

// ── Google OAuth ──────────────────────────────────────────────────────────────
export function loginWithGoogle() {
  if (USE_MOCK) {
    // Mock: simula login con Google
    const mockUser: User = { id: 99, nombre: "Usuario Google", email: "google@example.com" };
    saveSession("mock_token_google", mockUser);
    window.location.href = "/home";
    return;
  }
  window.location.href = `${API_URL}/auth/google`;
}