import { Router } from "express";
import * as pgC from "../controllers/pageController";

export const pageRoutes = Router();

// Rota principal
pageRoutes.get("/", pgC.startPage);

// Rota de login no mesmo router
pageRoutes.get("/login", (req, res) => {
    res.render("login"); // Renderiza views/login.ejs
});