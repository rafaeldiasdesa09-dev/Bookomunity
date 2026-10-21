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

const router = Router();

// --- Usuários ---
router.get("/usuarios", userController.listarUsuarios);
router.get("/usuarios/:id", userController.buscarUsuarioPorId);

// --- Livros ---
router.get("/livros", livroController.listarLivros);
router.get("/livro/:id", livroController.buscarLivroPorId);

// --- Clubes ---
router.get("/clubes", clubeController.listarClubes);
router.get("/clubes/:id", clubeController.buscarClubePorId);
router.get("/clubes/:id/membros", membroController.listarMembrosClube);

// --- Postagens ---
router.get("/postagens", postagemController.listarPostagens);
router.get("/postagens/:id", postagemController.buscarPostagemPorId);

// --- Recomendações de Livros ---
router.get("/recomendacoes", recomendacaoController.listarPedidos);

// --- Comentários ---
router.get("/postagens/:id/comentarios", comentarioController.listarComentariosPorPostagem);

// --- Curtidas ---
router.get("/postagens/:id/curtidas", likeController.contarLikesPorPostagem);

export default router;