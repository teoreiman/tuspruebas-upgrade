const USE_MOCK = true;
const REGISTERED_KEY = "tp_registered_users";

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

type StoredUser = { email: string; password: string; user: User };

const BASE_USERS: StoredUser[] = [
  { email: "teo@tuspruebas.com",   password: "123456",   user: { id: 1, nombre: "Teo Reiman",   email: "teo@tuspruebas.com"   } },
  { email: "fede@tuspruebas.com",  password: "123456",   user: { id: 2, nombre: "Fede Hanono",  email: "fede@tuspruebas.com"  } },
  { email: "manu@tuspruebas.com",  password: "123456",   user: { id: 3, nombre: "Manu Szwarc",  email: "manu@tuspruebas.com"  } },
  { email: "admin@tuspruebas.com", password: "admin123", user: { id: 0, nombre: "Admin",        email: "admin@tuspruebas.com" } },
];

function loadRegistered(): StoredUser[] {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    if (raw) return JSON.parse(raw) as StoredUser[];
  } catch {}
  return [];
}

function getAllUsers(): StoredUser[] {
  return [...BASE_USERS, ...loadRegistered()];
}

function persistRegistered(entry: StoredUser) {
  const all = loadRegistered();
  all.push(entry);
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(all));
}

// ── Sesión ────────────────────────────────────────────────────────────────────
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
  return getUser()?.id === 0;
}

// ── Login ─────────────────────────────────────────────────────────────────────
export async function loginWithEmail(email: string, password: string): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    const found = getAllUsers().find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Email o contraseña incorrectos");
    return { token: `tp_token_${found.user.id}`, user: found.user };
  }

  const API_URL = "http://localhost:3000/api";
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
    const exists = getAllUsers().find((u) => u.email === email);
    if (exists) throw new Error("Ya existe una cuenta con ese email");
    const newUser: User = { id: Date.now(), nombre, email };
    persistRegistered({ email, password, user: newUser });
    return { token: `tp_token_${newUser.id}`, user: newUser };
  }

  const API_URL = "http://localhost:3000/api";
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
    const mockUser: User = { id: 99, nombre: "Usuario Google", email: "google@example.com" };
    saveSession("tp_token_google", mockUser);
    window.location.href = "/home";
    return;
  }
  window.location.href = "http://localhost:3000/api/auth/google";
}
