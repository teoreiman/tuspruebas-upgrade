import jwt from "jsonwebtoken";
import type { VercelRequest } from "@vercel/node";

const SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  id: number;
  email: string;
  rol: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function getAuthUser(req: VercelRequest): JwtPayload | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(header.slice(7), SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
