import { Request, Response } from "express";
import pool from "../../config/database";

// Listar membros de um clube
export const listarMembrosClube = async (req: Request, res: Response): Promise<void> => {
    try {
        const idClube = Number(req.params.id);

        if (!Number.isInteger(idClube) || idClube <= 0) {
            res.status(400).json({ erro: "ID do clube inválido." });
            return;
        }

        const [membros] = await pool.execute(
            `SELECT
                m.usuario_id,
                m.clube_id,
                m.papel,
                m.data_entrada,
                u.nome,
                u.foto_perfil
             FROM membros_clube m
             INNER JOIN usuarios u ON m.usuario_id = u.id
             WHERE m.clube_id = ?`,
            [idClube]
        );

        res.status(200).json(membros);
    } catch (erro) {
        console.error("Erro ao listar membros:", erro);
        res.status(500).json({ erro: "Erro ao buscar membros do clube." });
    }
};