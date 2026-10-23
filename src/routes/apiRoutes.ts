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

const apiRoutes = Router();

// --- Usuários ---
apiRoutes.get("/usuarios", userController.listarUsuarios);
apiRoutes.get("/usuarios/:id", userController.buscarUsuarioPorId);

// --- Livros ---
apiRoutes.get("/livros", livroController.listarLivros);
apiRoutes.get("/livro/:id", livroController.buscarLivroPorId);

// --- Clubes ---
apiRoutes.get("/clubes", clubeController.listarClubes);
apiRoutes.get("/clubes/:id", clubeController.buscarClubePorId);
apiRoutes.get("/clubes/:id/membros", membroController.listarMembrosClube);

// --- Postagens ---
apiRoutes.get("/postagens", postagemController.listarPostagens);
apiRoutes.get("/postagens/:id", postagemController.buscarPostagemPorId);

apiRoutes.post("/postagens", postagemController.criarPostagem);
apiRoutes.delete("/postagens/:id", postagemController.deletarPostagem);
apiRoutes.put("/postagens/:id", postagemController.atualizarPostagem);

// --- Recomendações de Livros ---
apiRoutes.get("/recomendacoes", recomendacaoController.listarPedidos);

// --- Comentários ---
apiRoutes.get("/postagens/:id/comentarios", comentarioController.listarComentariosPorPostagem);

// --- Curtidas ---
apiRoutes.get("/postagens/:id/curtidas", likeController.contarLikesPorPostagem);

export default apiRoutes;