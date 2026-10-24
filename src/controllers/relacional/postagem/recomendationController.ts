import { Request, Response } from "express";
import pool from "../../../config/database";
import { ResultSetHeader } from "mysql2";



// -------------------- GET -------------------- //

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



// Buscar recomendação existente por ID
export const buscarPedidoPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.execute(
            `SELECT
                r.*,
                u.nome AS nome_usuario,
                l.titulo AS titulo_livro,
                p.titulo AS titulo_postagem
             FROM recomendacao_livros r
             LEFT JOIN usuarios u ON r.usuario_id = u.id
             LEFT JOIN livros l ON r.livro_id = l.id
             LEFT JOIN postagens p ON r.postagem_id = p.id
             WHERE r.id = ?`,
            [id]
        );

        const recomendacoes = resultado as Array<{ id: number }>;

        if (recomendacoes.length === 0) {
            res.status(404).json({ erro: "Recomendação não encontrada." });
            return;
        }

        res.status(200).json(recomendacoes[0]);
    } catch (erro) {
        console.error("Erro ao buscar recomendação:", erro);
        res.status(500).json({ erro: "Erro ao buscar recomendação." });
    }
};



// -------------------- POST -------------------- //

// Criar nova recomendação de livro em postagem (POST)
export const criarPedido = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postagem_id, usuario_id, livro_id } = req.body;

        if (!postagem_id || !usuario_id || !livro_id) {
            res.status(400).json({ erro: "Os campos 'postagem_id', 'usuario_id' e 'livro_id' são obrigatórios." });
            return;
        }

        if (!Number.isInteger(postagem_id) || postagem_id <= 0 || !Number.isInteger(usuario_id) || usuario_id <= 0 || !Number.isInteger(livro_id) || livro_id <= 0) {
            res.status(400).json({ erro: "IDs inválidos." });
            return;
        }

        const data_criacao = new Date();

        const [resultado] = await pool.execute<ResultSetHeader>(
            `INSERT INTO recomendacao_livros (postagem_id, usuario_id, livro_id, data_criacao) 
             VALUES (?, ?, ?, ?)`,
            [postagem_id, usuario_id, livro_id, data_criacao]
        );

        res.status(201).json({
            mensagem: "Recomendação cadastrada com sucesso!",
            id: resultado.insertId,
            postagem_id,
            usuario_id,
            livro_id,
            data_criacao
        });
    } catch (erro) {
        console.error("Erro ao criar recomendação:", erro);
        res.status(500).json({ erro: "Erro ao cadastrar recomendação." });
    }
};



// -------------------- PUT -------------------- //

// Atualizar recomendação existente (PUT)
export const atualizarPedido = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const { postagem_id, usuario_id, livro_id } = req.body;

        if (!postagem_id || !usuario_id || !livro_id) {
            res.status(400).json({ erro: "Os campos 'postagem_id', 'usuario_id' e 'livro_id' são obrigatórios." });
            return;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            `UPDATE recomendacao_livros 
             SET postagem_id = ?, usuario_id = ?, livro_id = ? 
             WHERE id = ?`,
            [postagem_id, usuario_id, livro_id, id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Recomendação não encontrada." });
            return;
        }

        res.status(200).json({ mensagem: "Recomendação atualizada com sucesso!" });
    } catch (erro) {
        console.error("Erro ao atualizar recomendação:", erro);
        res.status(500).json({ erro: "Erro ao atualizar recomendação." });
    }
};



// -------------------- DELETE -------------------- //

// Deletar recomendação (DELETE)
export const deletarPedido = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            "DELETE FROM recomendacao_livros WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Recomendação não encontrada." });
            return;
        }

        res.status(200).json({ mensagem: "Recomendação deletada com sucesso!" });
    } catch (erro) {
        console.error("Erro ao deletar recomendação:", erro);
        res.status(500).json({ erro: "Erro ao deletar recomendação." });
    }
};