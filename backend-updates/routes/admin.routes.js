import { Router } from "express";
import { getPendientes, getAllPruebas, cambiarEstado } from "../controllers/admin.controller.js";
import { verificarToken, verificarAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/admin/pruebas?estado=pendiente|aprobada|rechazada|todas
router.get("/pruebas",           verificarToken, verificarAdmin, getAllPruebas);

// PATCH /api/admin/pruebas/:id/estado  (ruta que espera el frontend)
router.patch("/pruebas/:id/estado", verificarToken, verificarAdmin, cambiarEstado);

// PATCH /api/admin/:id/estado          (ruta original — backward compat)
router.patch("/:id/estado",          verificarToken, verificarAdmin, cambiarEstado);

// GET /api/admin/pendientes            (compat)
router.get("/pendientes",            verificarToken, verificarAdmin, getPendientes);

export default router;
