import { Request, Response } from "express";
import pool from "../../config/database";

// Listar tudo
export const listarPostagens = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [postagens] = await pool.execute(
            `SELECT
                p.*,
                u.nome AS nome_usuario,
                c.nome AS nome_clube,
                l.titulo AS titulo_livro
             FROM postagens p
             LEFT JOIN usuarios u ON p.usuario_id = u.id
             LEFT JOIN clubes c ON p.clube_id = c.id
             LEFT JOIN livros l ON p.livro_id = l.id
             ORDER BY p.data_criacao DESC`
        );

        res.status(200).json(postagens);
    } catch (erro) {
        console.error("Erro ao listar postagens:", erro);
        res.status(500).json({ erro: "Erro ao buscar postagens." });
    }
};

// Buscar postagem existente por ID
export const buscarPostagemPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.execute(
            `SELECT
                p.*,
                u.nome AS nome_usuario,
                c.nome AS nome_clube,
                l.titulo AS titulo_livro
             FROM postagens p
             LEFT JOIN usuarios u ON p.usuario_id = u.id
             LEFT JOIN clubes c ON p.clube_id = c.id
             LEFT JOIN livros l ON p.livro_id = l.id
             WHERE p.id = ?`,
            [id]
        );

        const postagens = resultado as Array<{ id: number }>;

        if (postagens.length === 0) {
            res.status(404).json({ erro: "Postagem não encontrada." });
            return;
        }

        res.status(200).json(postagens[0]);
    } catch (erro) {
        console.error("Erro ao buscar postagem:", erro);
        res.status(500).json({ erro: "Erro ao buscar postagem." });
    }
};