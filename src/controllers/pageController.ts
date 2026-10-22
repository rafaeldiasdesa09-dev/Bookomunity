import { Request, Response } from "express";

export const startPage = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.render("index");
    } catch (erro) {
        console.error("Erro ao renderizar a página inicial:", erro);
        res.status(500).send("Erro interno ao carregar a página.");
    }
};

export const loginPage = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.render("login");
    } catch (erro) {
        console.error("Erro ao renderizar a página de login:", erro);
        res.status(500).send("Erro interno ao carregar a página.");
    }
};

export const registroPage = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.render("registro");
    } catch (erro) {
        console.error("Erro ao renderizar a página de registro:", erro);
        res.status(500).send("Erro interno ao carregar a página.");
    }
};

export const explorePage = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.render("explore");
    } catch (erro) {
        console.error("Erro ao renderizar a página explore:", erro);
        res.status(500).send("Erro interno ao carregar a página.");
    }
};

export const naoEncontradaPage = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.render("naoEncontrada");
    } catch (erro) {
        console.error("Erro ao renderizar a página 404:", erro);
        res.status(500).send("Erro interno ao carregar a página.");
    }
};

export const amizadesPage = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.render("friends");
    } catch (erro) {
        console.error("Erro ao renderizar a página de amizades:", erro);
        res.status(500).send("Erro interno ao carregar a página.");
    }
};

export const userPage = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.render("user");
    } catch (erro) {
        console.error("Erro ao renderizar a página de usuário:", erro);
        res.status(500).send("Erro interno ao carregar a página.");
    }
};