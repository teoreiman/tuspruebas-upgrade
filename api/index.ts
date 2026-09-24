import type { VercelRequest, VercelResponse } from "@vercel/node";

import adminPendientes from "./_src/admin/pendientes.js";
import adminRechazadas from "./_src/admin/rechazadas.js";
import adminEstado from "./_src/admin/[id]/estado.js";
import authLogin from "./_src/auth/login.js";
import authRegister from "./_src/auth/register.js";
import ia from "./_src/ia.js";
import iaConversaciones from "./_src/ia/conversaciones.js";
import iaConversacion from "./_src/ia/conversaciones/[id].js";
import iaGenerar from "./_src/ia/[id]/generar.js";
import notificaciones from "./_src/notificaciones/index.js";
import notificacionesLeerTodas from "./_src/notificaciones/leer-todas.js";
import notificacionLeida from "./_src/notificaciones/[id]/leida.js";
import pruebas from "./_src/pruebas/index.js";
import pruebasFavoritos from "./_src/pruebas/favoritos.js";
import pruebasMis from "./_src/pruebas/mis.js";
import prueba from "./_src/pruebas/[id].js";
import pruebaCalificar from "./_src/pruebas/[id]/calificar.js";
import pruebaFavorito from "./_src/pruebas/[id]/favorito.js";

// El plan Hobby de Vercel permite como máximo 12 funciones por deploy, y cada
// archivo dentro de /api cuenta como una. Por eso toda la API es esta única
// función: vercel.json reescribe /api/<ruta> a /api?__path=<ruta> y acá se
// despacha al handler correspondiente. Los handlers viven en /api/_src (las
// carpetas que empiezan con "_" no se convierten en funciones).

export const config = { maxDuration: 60 };

type Handler = (req: VercelRequest, res: VercelResponse) => unknown;

// ":id" captura un segmento y lo expone como req.query.id, igual que hacía el
// ruteo por archivos [id].ts. Las rutas literales van antes que las
// dinámicas (pruebas/mis antes que pruebas/:id).
const RUTAS: [string, Handler][] = [
  ["admin/pendientes", adminPendientes],
  ["admin/rechazadas", adminRechazadas],
  ["admin/:id/estado", adminEstado],
  ["auth/login", authLogin],
  ["auth/register", authRegister],
  ["ia", ia],
  ["ia/conversaciones", iaConversaciones],
  ["ia/conversaciones/:id", iaConversacion],
  ["ia/:id/generar", iaGenerar],
  ["notificaciones", notificaciones],
  ["notificaciones/leer-todas", notificacionesLeerTodas],
  ["notificaciones/:id/leida", notificacionLeida],
  ["pruebas", pruebas],
  ["pruebas/favoritos", pruebasFavoritos],
  ["pruebas/mis", pruebasMis],
  ["pruebas/:id", prueba],
  ["pruebas/:id/calificar", pruebaCalificar],
  ["pruebas/:id/favorito", pruebaFavorito],
];

function segmentos(ruta: string): string[] {
  return ruta.split("/").filter(Boolean);
}

function rutaPedida(req: VercelRequest): string {
  const desdeRewrite = req.query.__path;
  if (typeof desdeRewrite === "string") return desdeRewrite;
  // Sin rewrite (por ejemplo `vercel dev` pegándole a /api directo): sacar la
  // ruta de la URL.
  const pathname = (req.url ?? "").split("?")[0];
  return pathname.replace(/^\/api\/?/, "");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pedido = segmentos(rutaPedida(req));

  for (const [patron, destino] of RUTAS) {
    const partes = segmentos(patron);
    if (partes.length !== pedido.length) continue;

    const params: Record<string, string> = {};
    const coincide = partes.every((parte, i) => {
      if (parte.startsWith(":")) {
        params[parte.slice(1)] = decodeURIComponent(pedido[i]);
        return true;
      }
      return parte === pedido[i];
    });
    if (!coincide) continue;

    const { __path: _ignorado, ...query } = req.query;
    Object.defineProperty(req, "query", {
      value: { ...query, ...params },
      writable: true,
      configurable: true,
      enumerable: true,
    });
    return destino(req, res);
  }

  return res.status(404).json({ message: "Not found" });
}
