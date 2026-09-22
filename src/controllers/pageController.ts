import { Request, Response } from "express";

export async function startPage(req: Request, res: Response) {
    res.render("index")
}