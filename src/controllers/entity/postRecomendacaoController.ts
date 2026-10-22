import { Request, Response } from "express";
import pool from "../../config/database";

// Listar postagens que pedem por recomendações de livros
export const listarPedidos = async (_req: Request, res: Response): Promise<void> => {
     try {
        const [recomendacoes] = await pool.execute(
            `SELECT
                r.*,
                u.nome AS nome_usuario,
                l.titulo AS titulo_livro,
                p.titulo AS titulo_postagem
             FROM recomendacao_livros r
             LEFT JOIN usuarios u ON r.usuario_id = u.id
             LEFT JOIN livros l ON r.livro_id = l.id
             LEFT JOIN postagens p ON r.postagem_id = p.id
             ORDER BY r.data_criacao DESC`
        );

        res.status(200).json(recomendacoes);
    } catch (erro) {
        console.error("Erro ao listar recomendações:", erro);
        res.status(500).json({ erro: "Erro ao buscar recomendações." });
    }
};