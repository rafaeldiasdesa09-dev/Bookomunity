import { Request, Response } from "express";
import pool from "../../../config/database";
import { ResultSetHeader } from "mysql2";



// -------------------- GET -------------------- //

// Listar conversas/mensagens entre dois usuários
export const listarMensagensEntreUsuarios = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuario1 = Number(req.params.usuario1);
        const usuario2 = Number(req.params.usuario2);

        if (!Number.isInteger(usuario1) || usuario1 <= 0 || !Number.isInteger(usuario2) || usuario2 <= 0) {
            res.status(400).json({ erro: "IDs de usuário inválidos." });
            return;
        }

        const [mensagens] = await pool.query(
            `SELECT m.*, 
                    r.nome AS nome_remetente, 
                    d.nome AS nome_destinatario
             FROM mensagens_diretas m
             INNER JOIN usuarios r ON m.remetente_id = r.id
             INNER JOIN usuarios d ON m.destinatario_id = d.id
             WHERE (m.remetente_id = ? AND m.destinatario_id = ?) 
                OR (m.remetente_id = ? AND m.destinatario_id = ?)
             ORDER BY m.data_criacao ASC`,
            [usuario1, usuario2, usuario2, usuario1]
        );

        res.status(200).json(mensagens);
    } catch (erro) {
        console.error("Erro ao listar mensagens:", erro);
        res.status(500).json({ erro: "Erro ao buscar histórico de mensagens." });
    }
};



// -------------------- POST -------------------- //

// Enviar uma mensagem direta (POST)
export const enviarMensagem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { remetente_id, destinatario_id, conteudo } = req.body;

        if (!Number.isInteger(remetente_id) || remetente_id <= 0 || !Number.isInteger(destinatario_id) || destinatario_id <= 0) {
            res.status(400).json({ erro: "IDs de remetente ou destinatário inválidos." });
            return;
        }

        if (!conteudo || conteudo.trim() === "") {
            res.status(400).json({ erro: "O campo 'conteudo' é obrigatório." });
            return;
        }

        const data_criacao = new Date();

        const [resultado] = await pool.query<ResultSetHeader>(
            `INSERT INTO mensagens_diretas (remetente_id, destinatario_id, conteudo, lida, data_criacao) 
             VALUES (?, ?, ?, FALSE, ?)`,
            [remetente_id, destinatario_id, conteudo, data_criacao]
        );

        res.status(201).json({
            mensagem: "Mensagem enviada com sucesso!",
            id: resultado.insertId,
            remetente_id,
            destinatario_id,
            conteudo,
            lida: false,
            data_criacao
        });
    } catch (erro) {
        console.error("Erro ao enviar mensagem:", erro);
        res.status(500).json({ erro: "Erro ao enviar mensagem." });
    }
};



// -------------------- PUT -------------------- //

// Marcar mensagem como lida (PUT)
export const marcarMensagemComoLida = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID da mensagem inválido." });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            `UPDATE mensagens_diretas 
             SET lida = TRUE 
             WHERE id = ?`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Mensagem não encontrada." });
            return;
        }

        res.status(200).json({ mensagem: "Mensagem marcada como lida." });
    } catch (erro) {
        console.error("Erro ao atualizar status da mensagem:", erro);
        res.status(500).json({ erro: "Erro ao atualizar mensagem." });
    }
};



// -------------------- DELETE -------------------- //

// Deletar uma mensagem enviada (DELETE)
export const deletarMensagem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID da mensagem inválido." });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            "DELETE FROM mensagens_diretas WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Mensagem não encontrada." });
            return;
        }

        res.status(200).json({ mensagem: "Mensagem deletada com sucesso!" });
    } catch (erro) {
        console.error("Erro ao deletar mensagem:", erro);
        res.status(500).json({ erro: "Erro ao deletar mensagem." });
    }
};