import { Router } from "express";
import * as pgC from "../controllers/pageController";

const PAGE = Router();

// --- Páginas Principais e Autenticação ---
PAGE.get("/", pgC.startPage); // página inicial
PAGE.get("/login", pgC.loginPage); // login
PAGE.get("/registro", pgC.registroPage); // registro

// --- Navegação / Outras Páginas ---
PAGE.get("/explore", pgC.explorePage); // explore (página principal)
PAGE.get("/amizades", pgC.amizadesPage); // amizades
PAGE.get("/user", pgC.userPage); // perfil

// --- Tratamento de Erro / Páginas Especiais ---
PAGE.get("/lol", pgC.naoEncontradaPage); // pq rafa fez isso eu não sei

export default PAGE;