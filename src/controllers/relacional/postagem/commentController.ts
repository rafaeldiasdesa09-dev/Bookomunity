import { Request, Response } from "express";
import pool from "../../../config/database";
import { ResultSetHeader } from "mysql2";



// -------------------- GET -------------------- //

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



// -------------------- POST -------------------- //

// Criar um comentário em uma postagem (POST)
export const criarComentario = async (req: Request, res: Response): Promise<void> => {
    try {
        const postagem_id = Number(req.params.id);
        const { usuario_id, conteudo } = req.body;

        if (!Number.isInteger(postagem_id) || postagem_id <= 0 || !Number.isInteger(usuario_id) || usuario_id <= 0) {
            res.status(400).json({ erro: "IDs inválidos." });
            return;
        }

        if (!conteudo || conteudo.trim() === "") {
            res.status(400).json({ erro: "O campo 'conteudo' é obrigatório." });
            return;
        }

        const data_criacao = new Date();

        const [resultado] = await pool.execute<ResultSetHeader>(
            `INSERT INTO comentarios (conteudo, usuario_id, postagem_id, data_criacao) 
             VALUES (?, ?, ?, ?)`,
            [conteudo, usuario_id, postagem_id, data_criacao]
        );

        res.status(201).json({
            mensagem: "Comentário criado com sucesso!",
            id: resultado.insertId,
            conteudo,
            usuario_id,
            postagem_id,
            data_criacao
        });
    } catch (erro) {
        console.error("Erro ao criar comentário:", erro);
        res.status(500).json({ erro: "Erro ao cadastrar comentário." });
    }
};



// -------------------- PUT -------------------- //

// Atualizar um comentário existente (PUT)
export const atualizarComentario = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.comentarioId);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID do comentário inválido." });
            return;
        }

        const { conteudo } = req.body;

        if (!conteudo || conteudo.trim() === "") {
            res.status(400).json({ erro: "O campo 'conteudo' é obrigatório." });
            return;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            `UPDATE comentarios 
             SET conteudo = ? 
             WHERE id = ?`,
            [conteudo, id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Comentário não encontrado." });
            return;
        }

        res.status(200).json({ mensagem: "Comentário atualizado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao atualizar comentário:", erro);
        res.status(500).json({ erro: "Erro ao atualizar comentário." });
    }
};



// -------------------- DELETE -------------------- //

// Deletar um comentário (DELETE)
export const deletarComentario = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.comentarioId);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID do comentário inválido." });
            return;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            "DELETE FROM comentarios WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Comentário não encontrado." });
            return;
        }

        res.status(200).json({ mensagem: "Comentário deletado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao deletar comentário:", erro);
        res.status(500).json({ erro: "Erro ao deletar comentário." });
    }
};