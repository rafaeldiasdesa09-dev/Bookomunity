import { Request, Response, NextFunction } from "express";

export async function clientAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.session.userName) {
        req.session.flash = "Você deve fazer login primeiro.";
        return res.redirect("/login");
    }

    next();
}

export async function adminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.session.admin) {
        req.session.flash = "Acesso proibido.";
        return res.render("forbidden", { flash: req.session.flash });
    }

    next();
}

export async function jaLogado(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.session.admin && req.session.userName) {
        return res.redirect("/admin");
    } else if (!req.session.admin && req.session.userName) {
        return res.redirect("/explore");
    }

    next();
}