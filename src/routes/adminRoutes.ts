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

export const adminRoutes = Router();

// Aplica o middleware de proteção em todas as rotas deste router
adminRoutes.use(adminAuth);

adminRoutes.get("/", adminController.carregarPainelAdmin);
adminRoutes.get("/usuarios", adminController.listarUsuariosAdmin);
adminRoutes.patch("/usuarios/:id/perms", adminController.atualizarPermissaoUsuario);

export default adminRoutes;