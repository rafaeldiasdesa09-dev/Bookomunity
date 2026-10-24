import { Router } from "express";

// MEU DEUS DO CÉU
import * as userController from "../controllers/user/userController";
import * as livroController from "../controllers/entity/livroController";
import * as clubeController from "../controllers/entity/clubeController";
import * as membroController from "../controllers/entity/membroController";
import * as postagemController from "../controllers/entity/postagemController";
import * as recomendacaoController from "../controllers/entity/postRecomendacaoController";
import * as comentarioController from "../controllers/entity/comentarioController";
import * as likeController from "../controllers/entity/likeController";

const API = Router();

// --- Usuários ---
API.get("/usuarios", userController.listarUsuarios);
API.get("/usuarios/:id", userController.buscarUsuarioPorId);

// --- Livros ---
API.get("/livros", livroController.listarLivros);
API.get("/livro/:id", livroController.buscarLivroPorId);

// --- Clubes ---
API.get("/clubes", clubeController.listarClubes);
API.get("/clubes/:id", clubeController.buscarClubePorId);
API.get("/clubes/:id/membros", membroController.listarMembrosClube);

// --- Postagens ---
API.get("/postagens", postagemController.listarPostagens);
API.get("/postagens/:id", postagemController.buscarPostagemPorId);

API.post("/postagens", postagemController.criarPostagem);
API.delete("/postagens/:id", postagemController.deletarPostagem);
API.put("/postagens/:id", postagemController.atualizarPostagem);

// --- Recomendações de Livros ---
API.get("/recomendacoes", recomendacaoController.listarPedidos);

// --- Comentários ---
API.get("/postagens/:id/comentarios", comentarioController.listarComentariosPorPostagem);

// --- Curtidas ---
API.get("/postagens/:id/curtidas", likeController.contarLikesPorPostagem);

export default API;