import { Router } from "express";
import * as pgC from "../controllers/pageController";
import { isAuth, userAuth } from "../middlewares/auth";
import * as search from "../controllers/searchController"


const PAGE = Router();

// --- Páginas Principais e Autenticação ---
PAGE.get("/", isAuth, pgC.startPage);
PAGE.get("/login", isAuth, pgC.loginPage);
PAGE.get("/register", isAuth, pgC.registerPage);

// --- Navegação / Outras Páginas ---
PAGE.get("/explore", pgC.explorePage);
PAGE.get("/create-post", userAuth, pgC.createPostPage);
PAGE.get("/friends", userAuth, pgC.friendsPage);
PAGE.get("/options", isAuth, pgC.optionsPage);
PAGE.get("/profile", pgC.profilePage);
PAGE.get("/search", search.pesquisarDB);

// --- Tratamento de Erro / Páginas Especiais ---
PAGE.get("/lol", pgC.pageNotFound);

export default PAGE;
