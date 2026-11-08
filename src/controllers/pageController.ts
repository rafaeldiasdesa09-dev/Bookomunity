import { Request, Response } from "express";
import pool from "../config/database";


// Página inicial
export const startPage = (req: Request, res: Response): void => {
    const userName = req.session.userName;
    const sessionUserName = req.session.userName;
    try {
        const logado: boolean = (req.session.userId !== undefined);
        res.render("index", { logado: logado, page: req.path, isOwner: undefined, userName, sessionUserName });
    } catch (error) {
        console.error("Erro ao carregar a página inicial:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};



// Página de login
export const loginPage = (req: Request, res: Response): void => {
    const userName = req.session.userName;
    const sessionUserName = req.session.userName;
    try {
        res.status(200).render("login", { nome: undefined, isOwner: undefined, page: req.path, userName, sessionUserName });
    } catch (error) {
        console.error("Erro ao carregar a página de login:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};



// Página de registro
export const registerPage = (req: Request, res: Response): void => {
    const userName = req.session.userName;
    const sessionUserName = req.session.userName;
    try {
        res.status(200).render("registro", { nome: undefined, isOwner: undefined, page: req.path, userName, sessionUserName });
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
    const sessionUserName = req.session.userName;
    const userId = req.session.userId;

    try {
        const [livros] = await pool.query(
            `SELECT id, titulo, autor, descricao, capa
             FROM livros
             ORDER BY titulo ASC
             LIMIT 20`
        );

        let minhasPostagens = [];
        if (userId) {
            const queryPostagens = `
                SELECT 
                    p.*, 
                    p.avaliacao AS avaliacao,
                    u.nome AS nome_exibicao, 
                    u.nome_usuario AS nome, 
                    u.foto_perfil, 
                    l.titulo AS titulo_livro, 
                    l.capa AS capa_livro,
                    (SELECT COUNT(*) FROM curtidas c WHERE c.postagem_id = p.id) AS curtidas,
                    (SELECT COUNT(*) FROM comentarios com WHERE com.postagem_id = p.id) AS comentarios,
                    (SELECT COUNT(*) FROM recomendacao_livros rec WHERE rec.postagem_id = p.id) AS livros_recomendados
                FROM postagens p
                LEFT JOIN usuarios u ON p.usuario_id = u.id
                LEFT JOIN livros l ON p.livro_id = l.id
                WHERE p.usuario_id = ? 
                ORDER BY p.id DESC 
                LIMIT 20
            `;
            const [rows]: any = await pool.query(queryPostagens, [userId]);
            minhasPostagens = rows;
        }

        res.status(200).render("explore", {
            nome,
            foto,
            userName,
            sessionUserName,
            livros,
            minhasPostagens,
            fotoUsuario: foto,
            nomeExibicao: nome,
            page: req.path,
            isOwner: undefined
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
    const userName = req.session.userName;
    const sessionUserName = req.session.userName;
    try {
        res.status(404).render("naoEncontrada", { page: req.path, isOwner: undefined, userName, sessionUserName });
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
    const sessionUserName = req.session.userName;

    try {
        res.status(200).render("amizades", { nome, foto, page: req.path, isOwner: undefined, userName, sessionUserName });
    } catch (error) {
        console.error("Erro ao carregar a página de amizades:", error);
        res.status(500).send("Erro interno ao carregar a página de amizades.");
    }
};

// Página de perfil do usuário
export const profilePage = async (req: Request, res: Response): Promise<void> => {
    const userId = req.session.userId;
    const nome = req.session.userName;
    const foto = req.session.photo;
    const sessionUserName = req.session.userName;
    const userName = req.params.username ? req.params.username : req.session.userName;

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

        let statusAmizade = 'nenhuma';

        if (!isOwner && userId) {
            const [relacao]: any = await pool.query(
                `SELECT status FROM amizades 
                 WHERE (usuario_id = ? AND amigo_id = ?) 
                 OR (usuario_id = ? AND amigo_id = ?)`,
                [userId, usuarioPerfil.id, usuarioPerfil.id, userId]
            );

            if (relacao.length > 0) {
                statusAmizade = relacao[0].status;
            }
        }

        const [postagens] = await pool.query(
            `SELECT
                p.*,
                l.*
             FROM postagens p
             LEFT JOIN livros l ON p.livro_id = l.id
             WHERE p.usuario_id = ?
             ORDER BY p.data_criacao DESC`,
            [usuarioPerfil.id]
        );

        const [clubes]: any = await pool.query(
            `SELECT COUNT(usuario_id) AS total from membros_clube WHERE usuario_id = ?`,
            [usuarioPerfil.id]
        );

        const [amigos]: any = await pool.query(`SELECT COUNT(id) AS total FROM amizades WHERE status = "aceito"`)

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
            sessionUserName: sessionUserName,
            isOwner: isOwner,
            statusAmizade: statusAmizade,

            livrosFavoritos: [],
            minhasPostagens: postagens,
            amigos: amigos[0].total,
            clubes: clubes[0].total,
            page: req.path
        });

    } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
        res.status(500).send("Erro interno ao carregar o perfil.");
    }
};

// Buscar Livros Cadastrados para o Usuario Colocar no Formulario
export const createBookPage = async (req: Request, res: Response): Promise<void> => {
    const userName = req.session.userName;
    const sessionUserName = req.session.userName;
    try {
        const [livros] = await pool.query(
        "SELECT id, titulo, autor FROM livros ORDER BY titulo ASC"
        );

        res.render("createBook", {
            nome: req.session.userName,
            nome_exibicao: req.session.name,
            foto: req.session.photo,
            livros,
            page: req.path,
            isOwner: undefined,
            userName,
            sessionUserName,
            item: {
                nome: req.session.userName,
                nome_exibicao: req.session.name,
                foto_perfil: req.session.photo,
                titulo_livro: 'Livro',
                titulo: 'Título',
                conteudo: 'Conteúdo da postagem',
                curtidas: 0,
                comentarios: 0,
                avaliacao: 5
            },
        });

    } catch (error) {
        console.error("Erro ao carregar a página de criação:", error);
        res.status(500).send("Erro ao carregar a página de criação.");
    }
};

// Buscar Livros Cadastrados para o Usuario Colocar no Formulario
export const createPostPage = async (req: Request, res: Response): Promise<void> => {
    const userName = req.session.userName;
    const sessionUserName = req.session.userName;
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
            userName,
            sessionUserName,
            item: {
                nome: req.session.userName,
                nome_exibicao: req.session.name,
                foto_perfil: req.session.photo,
                titulo_livro: 'Livro',
                titulo: 'Título',
                conteudo: 'Conteúdo da postagem',
                curtidas: 0,
                comentarios: 0,
                avaliacao: 5
            },
        });

    } catch (error) {
        console.error("Erro ao carregar a página de criação:", error);
        res.status(500).send("Erro ao carregar a página de criação.");
    }
};