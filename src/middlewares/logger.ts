import { NextFunction, Request, Response } from "express";

export async function logger(req: Request, res: Response, next: NextFunction) {
    const date = `${new Date().toLocaleTimeString()} | ${new Date().toLocaleDateString()}`
    
    const content = `${date} || ${req.method} ${req.url}`

    console.log(content)
    next()
}