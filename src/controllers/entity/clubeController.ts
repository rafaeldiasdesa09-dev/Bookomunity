import { Request, Response } from "express";
import pool from "../../config/database";

// Listar tudo
export const listarClubes = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [clubes] = await pool.execute(
            `SELECT c.*, u.nome AS nome_criador
             FROM clubes c
             LEFT JOIN usuarios u ON c.criador_id = u.id`
        );

        res.status(200).json(clubes);
    } catch (erro) {
        console.error("Erro ao listar clubes:", erro);
        res.status(500).json({ erro: "Erro ao buscar clubes." });
    }
};

// Buscar clube existente por ID
export const buscarClubePorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.execute(
            `SELECT c.*, u.nome AS nome_criador
             FROM clubes c
             LEFT JOIN usuarios u ON c.criador_id = u.id
             WHERE c.id = ?`,
            [id]
        );

        const clubes = resultado as Array<{ id: number }>;

        if (clubes.length === 0) {
            res.status(404).json({ erro: "Clube não encontrado." });
            return;
        }

        res.status(200).json(clubes[0]);
    } catch (erro) {
        console.error("Erro ao buscar clube:", erro);
        res.status(500).json({ erro: "Erro ao buscar clube." });
    }
};