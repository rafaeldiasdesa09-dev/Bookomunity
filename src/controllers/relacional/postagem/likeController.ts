import { Request, Response } from "express";
import pool from "../../../config/database";
import { ResultSetHeader } from "mysql2";



// -------------------- GET -------------------- //

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



// -------------------- POST -------------------- //

// Curtir uma postagem (POST)
export const curtirPostagem = async (req: Request, res: Response): Promise<void> => {
    try {
        const postagem_id = Number(req.params.id);
        const { usuario_id } = req.body;

        if (!Number.isInteger(postagem_id) || postagem_id <= 0 || !Number.isInteger(usuario_id) || usuario_id <= 0) {
            res.status(400).json({ erro: "IDs inválidos." });
            return;
        }

        const data_criacao = new Date();

        await pool.execute<ResultSetHeader>(
            `INSERT INTO curtidas (usuario_id, postagem_id, data_criacao) 
             VALUES (?, ?, ?)`,
            [usuario_id, postagem_id, data_criacao]
        );

        res.status(201).json({ mensagem: "Postagem curtida com sucesso!" });
    } catch (erro: any) {
        // Trata erro de chave duplicada (caso o usuário já tenha curtido a postagem)
        if (erro.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ erro: "Você já curtiu esta postagem." });
            return;
        }
        console.error("Erro ao curtir postagem:", erro);
        res.status(500).json({ erro: "Erro ao registrar curtida." });
    }
};



// -------------------- DELETE -------------------- //

// Descurtir uma postagem (DELETE)
export const descurtirPostagem = async (req: Request, res: Response): Promise<void> => {
    try {
        const postagem_id = Number(req.params.id);
        const usuario_id = Number(req.params.usuarioId);

        if (!Number.isInteger(postagem_id) || postagem_id <= 0 || !Number.isInteger(usuario_id) || usuario_id <= 0) {
            res.status(400).json({ erro: "IDs inválidos." });
            return;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            `DELETE FROM curtidas 
             WHERE postagem_id = ? AND usuario_id = ?`,
            [postagem_id, usuario_id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Curtida não encontrada." });
            return;
        }

        res.status(200).json({ mensagem: "Curtida removida com sucesso!" });
    } catch (erro) {
        console.error("Erro ao descurtir postagem:", erro);
        res.status(500).json({ erro: "Erro ao remover curtida." });
    }
};