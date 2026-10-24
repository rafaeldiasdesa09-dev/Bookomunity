import { Router } from "express";
import { adminAuth } from "../middlewares/auth";
import * as adminController from "../controllers/adminController";

type UsuarioSessao = {
    id: number;
    nome: string;
    email: string;
    perms: string;
};

declare module "express-session" {
    interface SessionData {
        usuario?: UsuarioSessao;
    }
}

export const ADMIN = Router();

// Aplica o middleware de proteção em todas as rotas deste router
ADMIN.use(adminAuth);

ADMIN.get("/", adminController.carregarPainelAdmin);
ADMIN.get("/usuarios", adminController.listarUsuariosAdmin);
ADMIN.patch("/usuarios/:id/perms", adminController.atualizarPermissaoUsuario);

export default ADMIN;