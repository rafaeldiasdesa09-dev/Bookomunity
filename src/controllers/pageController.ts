import { Request, Response } from "express";

export async function startPage(req: Request, res: Response) {
    res.render("index")
}

export async function loginPage(req: Request, res: Response) {
    res.render("login")
}


export async function basePage(req: Request, res: Response) {
    res.render("base")
}


export async function amizadesPage(req: Request, res: Response) {
    res.render("friends")
}


export async function userPahe(req: Request, res: Response) {
    res.render("user")
}
