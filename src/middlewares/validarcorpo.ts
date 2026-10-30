
import { Request, Response, NextFunction, RequestHandler } from "express";
import Ajv, { AnySchema } from "ajv";

import { schemas } from "../contratos/esquemas";

const ajv = new Ajv({
    allErrors: true,
    strict: false
});

type NomeSchema = keyof typeof schemas;

export const validarCorpo = (nomeSchema: NomeSchema): RequestHandler => {
    const validar = ajv.compile(schemas[nomeSchema] as AnySchema);

    return (req: Request, res: Response, next: NextFunction): void => {
        const valido = validar(req.body);

        if (!valido) {
            const erros = validar.errors?.map((erro) => ({
                campo: erro.instancePath || "/",
                mensagem: erro.message,
                tipo: erro.keyword
            }));

            res.status(400).json({
                sucesso: false,
                mensagem: "Os dados enviados são inválidos.",
                erros
            });

            return;
        }

        next();
    };
};

export default validarCorpo;
