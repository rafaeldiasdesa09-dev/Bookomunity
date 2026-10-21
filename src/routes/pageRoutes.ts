import { Router } from "express";
import * as pgC from "../controllers/pageController";

export const pageRoutes = Router();

// Rota principal
pageRoutes.get("/", pgC.startPage);

// Rota de login no mesmo router
pageRoutes.get("/login", (req, res) => {
    res.render("login"); // Renderiza views/login.ejs
});
// Rota de registro
pageRoutes.get("/registro", (req, res) => {
    res.render("registro"); // Certifique-se de que o arquivo views/registro.ejs (ou o nome correto) existe
});

// Rota de EXPLORE no mesmo router
pageRoutes.get("/explore", (req, res) => {
    res.render("explore");
});