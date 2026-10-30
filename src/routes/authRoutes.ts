    import { Router } from "express";
    import { upload } from "../middlewares/upload";
    import * as authController from "../controllers/user/authController";


    const router = Router();

    // --- Autenticação / Usuários ---
    router.post("/registro", upload.single("foto"), authController.registrarUsuario);
    router.post("/login", authController.loginUsuario);
    router.post("/logoff", authController.sairDoUsuario)

    export default router;