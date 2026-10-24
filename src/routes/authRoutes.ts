import { Router } from "express";
import { upload } from "../middlewares/upload";
import * as authController from "../controllers/user/authController";


const AUTH = Router();

// --- Autenticação / Usuários ---
AUTH.post("/registro", upload.single("foto"), authController.registrarUsuario);
AUTH.post("/login", authController.loginUsuario);
AUTH.post("/logoff", authController.sairDoUsuario)

export default AUTH;