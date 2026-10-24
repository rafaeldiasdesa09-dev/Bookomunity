import { Request, Response, NextFunction } from "express";

export async function userAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.session.userName) {
        req.session.flash = "Você deve fazer login primeiro.";
        return res.redirect("/login");
    }

    next();
}

// Se o usuário não for admin, será redirecionado ao erro 403
export async function adminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.session.admin) {
        req.session.flash = "Acesso proibido.";
        res.render("forbidden", { flash: req.session.flash });
        res.status(403).json({"success": false, "message":"Você não tem permissão para acessar isso."});
        return
    }

    next();
}

export async function isAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.session.admin && req.session.userName) {
        return res.redirect("/admin");
    } else if (!req.session.admin && req.session.userName) {
        return res.redirect("/explore");
    }

    next();
}