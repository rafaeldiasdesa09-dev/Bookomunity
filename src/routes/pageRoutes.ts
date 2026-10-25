import { Router } from "express";
import * as pgC from "../controllers/pageController";
import { isAuth } from "../middlewares/auth";
import * as search from "../controllers/searchController"


const PAGE = Router();

// --- Páginas Principais e Autenticação ---
PAGE.get("/", isAuth, pgC.startPage); // página inicial
PAGE.get("/login", isAuth, pgC.loginPage); // login
PAGE.get("/register", isAuth, pgC.registerPage); // registro

// --- Navegação / Outras Páginas ---
PAGE.get("/explore", pgC.explorePage); // explore (página principal)
PAGE.get("/friends", isAuth, pgC.friendsPage); // amizades
PAGE.get("/options", isAuth, pgC.optionsPage); // amizades
PAGE.get("/profile", pgC.profilePage); // perfil
PAGE.get("/search", search.pesquisarDB)

// --- Tratamento de Erro / Páginas Especiais ---
PAGE.get("/lol", pgC.pageNotFound); // pq rafa fez isso eu não sei

export default PAGE;