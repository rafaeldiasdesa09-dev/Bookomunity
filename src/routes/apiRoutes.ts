import { Router }  from "express";
import { isAuth } from "../middlewares/auth";

// Controllers
import * as users from "../controllers/user/userController";
import * as livros from "../controllers/entity/bookController";
import * as clubes from "../controllers/entity/clubController";
import * as membros from "../controllers/relacional/clube/memberController";
import * as postagens from "../controllers/entity/postsController";
import * as recomendacoes from "../controllers/relacional/postagem/recomendationController";
import * as comentarios from "../controllers/relacional/postagem/commentController";
import * as likes from "../controllers/relacional/postagem/likeController";
import * as amizades from "../controllers/relacional/user/friendsController";
import * as mensagens from "../controllers/relacional/user/messageController";
import * as search from "../controllers/searchController"

const API = Router();

// --- Usuários ---
API.get("/usuarios", users.listarUsuarios);
API.get("/usuarios/:id", users.buscarUsuarioPorId);

// --- livross ---
API.get("/livros", livros.listarLivros);
API.get("/livros/:id", livros.buscarLivroPorId);
API.post("/livros", livros.criarLivro);
API.put("/livros/:id", livros.atualizarLivro);
API.delete("/livros/:id", livros.deletarLivro);

// --- Clubes ---
API.get("/clubes", clubes.listarClubes);
API.get("/clubes/:id", clubes.buscarClubePorId);
API.post("/clubes", clubes.criarClube);
API.put("/clubes/:id", clubes.atualizarClube);
API.delete("/clubes/:id", clubes.deletarClube);

// --- Membros de Clubes ---
API.get("/clubes/:id/membros", membros.listarMembrosClube);
API.post("/clubes/:id/membros", membros.adicionarMembroClube);
API.put("/clubes/:id/membros/:usuarioId", membros.atualizarPapelMembro);
API.delete("/clubes/:id/membros/:usuarioId", membros.removerMembroClube);

// --- Postagens ---
API.get("/postagens", postagens.listarPostagens);
API.get("/postagens/:id", postagens.buscarPostagemPorId);
API.post("/postagens", isAuth, postagens.criarPostagem);
API.put("/postagens/:id", postagens.atualizarPostagem);
API.delete("/postagens/:id", postagens.deletarPostagem);

// --- Recomendações de livross ---
API.get("/recomendacoes", recomendacoes.listarPedidos);
API.get("/recomendacoes/:id", recomendacoes.buscarPedidoPorId);
API.post("/recomendacoes", recomendacoes.criarPedido);
API.put("/recomendacoes/:id", recomendacoes.atualizarPedido);
API.delete("/recomendacoes/:id", recomendacoes.deletarPedido);

// --- Comentários ---
API.get("/postagens/:id/comentarios", comentarios.listarComentariosPorPostagem);
API.post("/postagens/:id/comentarios", comentarios.criarComentario);
API.put("/comentarios/:comentarioId", comentarios.atualizarComentario);
API.delete("/comentarios/:comentarioId", comentarios.deletarComentario);

// --- Curtidas ---
API.get("/postagens/:id/curtidas", likes.contarLikesPorPostagem);
API.post("/postagens/:id/curtidas", likes.curtirPostagem);
API.delete("/postagens/:id/curtidas/:usuarioId", likes.descurtirPostagem);

// --- Amizades ---
API.get("/usuarios/:id/amigos", amizades.listarAmigos);
API.get("/usuarios/:id/amigos/pedidos", amizades.listarPedidosAmizadePendentes);
API.post("/amizades", amizades.enviarPedidoAmizade);
API.put("/amizades/:id", amizades.aceitarPedidoAmizade);
API.delete("/amizades/:id", amizades.removerAmizade);

// --- Mensagens Diretas ---
API.get("/mensagens/:usuario1/:usuario2", mensagens.listarMensagensEntreUsuarios);
API.post("/mensagens", mensagens.enviarMensagem);
API.put("/mensagens/:id/lida", mensagens.marcarMensagemComoLida);
API.delete("/mensagens/:id", mensagens.deletarMensagem);

export default API;