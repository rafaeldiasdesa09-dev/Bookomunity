import { NextFunction, Request, Response } from "express";
import { consoleContent } from "../types/serverConsole";

export async function logger(req: Request, res: Response, next: NextFunction) {
    const date = `${new Date().toLocaleTimeString()} | ${new Date().toLocaleDateString()}`
    
    const content = `${date} || ${req.method} ${req.url}`

    console.log(content)
    consoleContent.push(content)

    next()
}