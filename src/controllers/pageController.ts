
import type { Request, Response } from "express";
import pool from "../config/database";

// Página inicial
export const startPage = (
    req: Request,
    res: Response
): void => {
    const logado: boolean = (req.session.userId !== undefined)
    res.render("index", {logado: logado});
};

// Página de login
export const loginPage = (
    req: Request,
    res: Response
): void => {
    res.render("login");
};

// Página de registro
export const registroPage = (
    req: Request,
    res: Response
): void => {
    res.render("registro");
};

// Página Explore
export const explorePage = async (
    req: Request,
    res: Response
): Promise<void> => {

    const foto = req.session.photo
    const nome = req.session.userName

    try {
        res.render("explore", {
            nome: nome,
            foto: foto
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
    req: Request,
    res: Response
): void => {
    res.status(404).render("naoEncontrada");
};

// Página de amizades
export const amizadesPage = (
    req: Request,
    res: Response
): void => {
    res.render("friends");
};

// Página de perfil do usuário
export const userPage = (
    req: Request,
    res: Response
): void => {
    res.render("user");
};
