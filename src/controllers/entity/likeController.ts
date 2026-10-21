import { Request, Response } from "express";
import pool from "../../config/database";

// Contar total de likes em uma postagem
export const contarLikesPorPostagem = async (req: Request, res: Response): Promise<void> => {
    try {
        const idPostagem = Number(req.params.id);

        if (!Number.isInteger(idPostagem) || idPostagem <= 0) {
            res.status(400).json({ erro: "ID da postagem inválido." });
            return;
        }

        const [resultado] = await pool.execute(
            `SELECT COUNT(*) AS total
             FROM curtidas
             WHERE postagem_id = ?`,
            [idPostagem]
        );

        res.status(200).json(resultado);
    } catch (erro) {
        console.error("Erro ao contar curtidas:", erro);
        res.status(500).json({ erro: "Erro ao buscar curtidas." });
    }
};