import { Router } from "express";
import * as pgC from "../controllers/pageController";

const pageRoutes = Router();

// --- Páginas Principais e Autenticação ---
pageRoutes.get("/", pgC.startPage); // página inicial
pageRoutes.get("/login", pgC.loginPage); // login
pageRoutes.get("/registro", pgC.registroPage); // registro

// --- Navegação / Outras Páginas ---
pageRoutes.get("/explore", pgC.explorePage); // explore (página principal)
pageRoutes.get("/amizades", pgC.amizadesPage); // amizades
pageRoutes.get("/user", pgC.userPage); // perfil

// --- Tratamento de Erro / Páginas Especiais ---
pageRoutes.get("/lol", pgC.naoEncontradaPage); // pq rafa fez isso eu não sei

export default pageRoutes;