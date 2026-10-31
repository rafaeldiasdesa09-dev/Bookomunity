import { Request, Response } from "express";
import pool from "../config/database";


// Página inicial
export const startPage = (req: Request, res: Response): void => {
    try {
        const logado: boolean = (req.session.userId !== undefined);
        res.render("index", { logado: logado });
    } catch (error) {
        console.error("Erro ao carregar a página inicial:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};



// Página de login
export const loginPage = (req: Request, res: Response): void => {
    try {
        res.status(200).render("login");
    } catch (error) {
        console.error("Erro ao carregar a página de login:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};



// Página de registro
export const registerPage = (req: Request, res: Response): void => {
    try {
        res.status(200).render("registro");
    } catch (error) {
        console.error("Erro ao carregar a página de registro:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};




 // Página Explore
 export const explorePage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const foto = req.session.photo;
    const nome = req.session.userName;

    try {
        // Busca os livros cadastrados no banco
        const [livros] = await pool.query(
            `SELECT id, titulo, autor, descricao, capa
             FROM livros
             ORDER BY titulo ASC
             LIMIT 20`
        );

        // Envia os dados para explore.ejs
        res.status(200).render("explore", {
            nome,
            foto,
            livros
        });

    } catch (error) {
        console.error("Erro ao carregar a página Explore:", error);
        res.status(500).send(
            "Erro interno ao carregar a página Explore."
        );
    }
};




// Página 404
export const pageNotFound = (req: Request, res: Response): void => {
    try {
        res.status(404).render("naoEncontrada");
    } catch (error) {
        console.error("Erro ao carregar a página 404:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};



// Página de amizades
export const friendsPage = (req: Request, res: Response): void => {
    const foto = req.session.photo;
    const nome = req.session.userName;

    try {
        res.status(200).render("amizades", { nome, foto });
    } catch (error) {
        console.error("Erro ao carregar a página de amizades:", error);
        res.status(500).send("Erro interno ao carregar a página de amizades.");
    }
};

// Página de perfil do usuário
export const profilePage = async (req: Request, res: Response): Promise<void> => {
    const usuarioLogadoId = req.session.userId;
    const nome = req.session.userName
    const foto = req.session.photo

    const perfilId = req.params.id ? Number(req.params.id) : usuarioLogadoId;

    const isOwner = perfilId === usuarioLogadoId;

    try {
        const [usuarioResult]: any = await pool.query(
            `SELECT nome, email, foto_perfil, bio FROM usuarios WHERE id = ?`, 
            [perfilId]
        );

        if (usuarioResult.length === 0) {
            res.status(404).send("Usuário não encontrado.");
            return;
        }

        const usuarioPerfil = usuarioResult[0];

        const [postagens] = await pool.query(
            `SELECT
                p.*,
                l.titulo AS titulo_livro
             FROM postagens p
             LEFT JOIN livros l ON p.livro_id = l.id
             WHERE p.usuario_id = ?
             ORDER BY p.data_criacao DESC`,
            [perfilId]
        );

        res.render("user", {
            nome: nome,
            foto: foto,
            nomeUsuario: usuarioPerfil.nome,
            fotoUsuario: usuarioPerfil.foto_perfil,
            bio: usuarioPerfil.bio || "",
            
            usuarioLogadoId: usuarioLogadoId,

            
            isOwner: isOwner,

            livrosFavoritos: [],
            minhasPostagens: postagens,
            amigos: [],
            clubes: []
        });

    } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
        res.status(500).send("Erro interno ao carregar o perfil.");
    }
};

// Página de perfil do usuário
export const optionsPage = (req: Request, res: Response): void => {
    const foto = req.session.photo
    const nome = req.session.userName

    try {
        res.render("explore", {nome: nome, foto: foto});
        res.status(200)
    } catch (error) {
        console.error("Erro ao carregar a página de perfil:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};

// Buscar Livros Cadastrados para o Usuario Colocar no Formulario
export const createPostPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [livros] = await pool.query(
      "SELECT id, titulo, autor FROM livros ORDER BY titulo ASC"
    );

    res.render("createPost", {
      nome: req.session.userName,
      foto: req.session.photo,
      livros
    });
  } catch (error) {
    console.error("Erro ao carregar a página de criação:", error);
    res.status(500).send("Erro ao carregar a página de criação.");
  }
};