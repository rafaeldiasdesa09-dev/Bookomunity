import { Request, Response } from "express";
import pool from "../config/database";


// Página inicial
export const startPage = (req: Request, res: Response): void => {
    const userName = req.session.userName
    try {
        const logado: boolean = (req.session.userId !== undefined);
        res.render("index", { logado: logado, page: req.path, isOwner: undefined, userName });
    } catch (error) {
        console.error("Erro ao carregar a página inicial:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};



// Página de login
export const loginPage = (req: Request, res: Response): void => {
    const userName = req.session.userName
    try {
        res.status(200).render("login", {nome: undefined, isOwner: undefined, page: req.path, userName});
    } catch (error) {
        console.error("Erro ao carregar a página de login:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};



// Página de registro
export const registerPage = (req: Request, res: Response): void => {
    const userName = req.session.userName
    try {
        res.status(200).render("registro", {nome: undefined, isOwner: undefined, page: req.path, userName});
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
    const userName = req.session.userName;

    try {
        const [livros] = await pool.query(
            `SELECT id, titulo, autor, descricao, capa
             FROM livros
             ORDER BY titulo ASC
             LIMIT 20`
        );

        res.status(200).render("explore", {
            nome,
            foto,
            livros,
            page: req.path,
            isOwner: undefined,
            userName
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
    const userName = req.session.userName
    try {
        res.status(404).render("naoEncontrada", {page: req.path, isOwner: undefined, userName});
    } catch (error) {
        console.error("Erro ao carregar a página 404:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};



// Página de amizades
export const friendsPage = (req: Request, res: Response): void => {
    const foto = req.session.photo;
    const nome = req.session.userName;
    const userName = req.session.userName;

    try {
        res.status(200).render("amizades", { nome, foto, page: req.path, isOwner: undefined, userName});
    } catch (error) {
        console.error("Erro ao carregar a página de amizades:", error);
        res.status(500).send("Erro interno ao carregar a página de amizades.");
    }
};

// Página de perfil do usuário
export const profilePage = async (req: Request, res: Response): Promise<void> => {
    const userId = req.session.userId;
    const nome = req.session.userName
    const foto = req.session.photo
    const userName = req.params.username

    try {
        const [usuarioResult]: any = await pool.query(
            `SELECT id, nome, nome_usuario, email, foto_perfil, bio FROM usuarios WHERE nome_usuario = ?`, 
            [userName]
        );

        if (usuarioResult.length === 0) {
            res.status(404).send("Usuário não encontrado.");
            return;
        }

        const usuarioPerfil = usuarioResult[0];

        const isOwner = Number(userId) === usuarioPerfil.id;

        const [postagens] = await pool.query(
            `SELECT
                p.*,
                l.titulo AS titulo_livro
             FROM postagens p
             LEFT JOIN livros l ON p.livro_id = l.id
             WHERE p.usuario_id = ?
             ORDER BY p.data_criacao DESC`,
            [usuarioPerfil.id]
        );

        res.render("user", {
            nome: nome,
            foto: foto,
            id: usuarioPerfil.id,
            sessionId: userId,
            nomeExibicao: usuarioPerfil.nome,
            fotoUsuario: usuarioPerfil.foto_perfil,
            nomeUsuario: usuarioPerfil.nome_usuario,
            bio: usuarioPerfil.bio || "",
            
            userName: userName,
            
            isOwner: isOwner,

            livrosFavoritos: [],
            minhasPostagens: postagens,
            amigos: [],
            clubes: [],
            page: req.path
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
    const userName = req.session.userName

    try {
        res.render("explore", {nome: nome, foto: foto, page: req.path, isOwner: undefined, userName});
        res.status(200)
    } catch (error) {
        console.error("Erro ao carregar a página de perfil:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};

// Buscar Livros Cadastrados para o Usuario Colocar no Formulario
export const createPostPage = async (req: Request, res: Response): Promise<void> => {
    const userName = req.session.userName
    try {
        const [livros] = await pool.query(
        "SELECT id, titulo, autor FROM livros ORDER BY titulo ASC"
        );

        res.render("createPost", {
        nome: req.session.userName,
        nome_exibicao: req.session.name,
        foto: req.session.photo,
        livros,
        page: req.path,
        isOwner: undefined,
        userName
        });
    } catch (error) {
        console.error("Erro ao carregar a página de criação:", error);
        res.status(500).send("Erro ao carregar a página de criação.");
    }
};