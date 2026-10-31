import { Router } from "express";
import * as page from "../controllers/pageController";
import { isAuth, userAuth } from "../middlewares/auth";
import * as search from "../controllers/searchController"


const PAGE = Router();

// --- Páginas Principais e Autenticação ---
PAGE.get("/", isAuth, page.startPage);
PAGE.get("/login", isAuth, page.loginPage);
PAGE.get("/register", isAuth, page.registerPage);

// --- Navegação / Outras Páginas ---
PAGE.get("/explore", page.explorePage);
PAGE.get("/create-post", userAuth, page.createPostPage);
PAGE.get("/friends", userAuth, page.friendsPage);
PAGE.get("/options", isAuth, page.optionsPage);
PAGE.get("/profile/:id", page.profilePage);
PAGE.get("/search", search.pesquisarDB);

export default PAGE;
