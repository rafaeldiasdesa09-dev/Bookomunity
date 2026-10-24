import { Router } from "express";
import { adminAuth } from "../middlewares/auth";
import * as admin from "../controllers/adminController";

export const ADMIN = Router();

// Aplica o middleware de proteção em todas as rotas deste router
ADMIN.use(adminAuth);

ADMIN.get("/", admin.carregarPainelAdmin);
ADMIN.get("/usuarios", admin.listarUsuariosAdmin);
ADMIN.patch("/usuarios/:id/perms", admin.atualizarPermissaoUsuario);

export default ADMIN;