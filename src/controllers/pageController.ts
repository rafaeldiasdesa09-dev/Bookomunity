import { Request, Response } from "express";



// Página inicial
export const startPage = (req: Request, res: Response): void => {
    try {
        const logado: boolean = (req.session.userId !== undefined);
        res.render("index", { logado: logado });
        console.log(req.session)
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
export const explorePage = async (req: Request, res: Response): Promise<void> => {
    const foto = req.session.photo
    const nome = req.session.userName

    try {
        res.render("explore", {nome: nome, foto: foto});
        res.status(200)
    } catch (error) {
        console.error("Erro ao carregar a página Explore:", error);
        res.status(500).send("Erro interno ao carregar a página Explore.");
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
    const foto = req.session.photo
    const nome = req.session.userName

    try {
        res.render("explore", {nome: nome, foto: foto});
        res.status(200)
    } catch (error) {
        console.error("Erro ao carregar a página de amizades:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};



// Página de perfil do usuário
export const profilePage = (req: Request, res: Response): void => {
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