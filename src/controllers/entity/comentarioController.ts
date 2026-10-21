import { Request, Response } from "express";
import pool from "../../config/database";

// Listar comentários por postagem
export const listarComentariosPorPostagem = async (req: Request, res: Response): Promise<void> => {
    try {
        const idPostagem = Number(req.params.id);

        if (!Number.isInteger(idPostagem) || idPostagem <= 0) {
            res.status(400).json({ erro: "ID da postagem inválido." });
            return;
        }

        const [comentarios] = await pool.execute(
            `SELECT
                c.*,
                u.nome AS nome_usuario,
                u.foto_perfil
             FROM comentarios c
             INNER JOIN usuarios u ON c.usuario_id = u.id
             WHERE c.postagem_id = ?
             ORDER BY c.data_criacao ASC`,
            [idPostagem]
        );

        res.status(200).json(comentarios);
    } catch (erro) {
        console.error("Erro ao listar comentários:", erro);
        res.status(500).json({ erro: "Erro ao buscar comentários." });
    }
};