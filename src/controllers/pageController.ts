
import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import pool from "../config/database";

// Dados do usuário retornados pelo banco
interface Usuario extends RowDataPacket {
    id: number;
    nome: string | null;
    foto_perfil: string | null;
}

// Recupera o ID do usuário salvo na sessão
function obterUsuarioId(req: Request): number | undefined {
    const id = (req.session as any)?.usuarioId;

    if (id === undefined || id === null || id === "") {
        return undefined;
    }

    const usuarioId = Number(id);

    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
        return undefined;
    }

    return usuarioId;
}

// Página inicial
export const startPage = (
    _req: Request,
    res: Response
): void => {
    res.render("index");
};

// Página de login
export const loginPage = (
    _req: Request,
    res: Response
): void => {
    res.render("login");
};

// Página de registro
export const registroPage = (
    _req: Request,
    res: Response
): void => {
    res.render("registro");
};

// Página Explore
export const explorePage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const usuarioId = obterUsuarioId(req);

        // A página também pode ser acessada sem login
        if (!usuarioId) {
            res.render("explore", {
                nome: null,
                foto: null,
                minhasPostagens: [],
                postagensAmigos: []
            });
            return;
        }

        // Busca os dados do usuário no MySQL
        const [linhas] = await pool.execute<Usuario[]>(
            `SELECT id, nome, foto_perfil
             FROM usuarios
             WHERE id = ?
             LIMIT 1`,
            [usuarioId]
        );

        // Se a conta não existir, limpa os dados da sessão
        if (linhas.length === 0) {
            (req.session as any).usuarioId = undefined;

            res.redirect("/login");
            return;
        }

        const usuario = linhas[0];

        // Disponibiliza os dados para o arquivo explore.ejs
        res.render("explore", {
            nome: req.session.userName,
            foto:req.session.photo,
            minhasPostagens: [],
            postagensAmigos: []
        });
    } catch (erro: unknown) {
        console.error("Erro ao carregar a página Explore:", erro);

        res.status(500).send(
            "Erro interno ao carregar a página Explore."
        );
    }
};

// Página 404
export const naoEncontradaPage = (
    _req: Request,
    res: Response
): void => {
    res.status(404).render("naoEncontrada");
};

// Página de amizades
export const amizadesPage = (
    _req: Request,
    res: Response
): void => {
    res.render("friends");
};

// Página de perfil do usuário
export const userPage = (
    _req: Request,
    res: Response
): void => {
    res.render("user");
};
