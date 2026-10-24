import { Request, Response } from "express";
import pool from "../../../config/database";
import { ResultSetHeader } from "mysql2";



// -------------------- GET -------------------- //

// Listar amigos aceitos de um usuário
export const listarAmigos = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarioId = Number(req.params.id);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            res.status(400).json({ erro: "ID do usuário inválido." });
            return;
        }

        const [amigos] = await pool.query(
            `SELECT a.id AS amizade_id, a.status, a.data_criacao,
                    u.id AS usuario_id, u.nome, u.email, u.foto_perfil, u.bio
             FROM amizades a
             INNER JOIN usuarios u ON (
                 (a.usuario_id = ? AND a.amigo_id = u.id) OR 
                 (a.amigo_id = ? AND a.usuario_id = u.id)
             )
             WHERE (a.usuario_id = ? OR a.amigo_id = ?) AND a.status = 'aceito'`,
            [usuarioId, usuarioId, usuarioId, usuarioId]
        );

        res.status(200).json(amigos);
    } catch (erro) {
        console.error("Erro ao listar amigos:", erro);
        res.status(500).json({ erro: "Erro ao buscar amigos." });
    }
};

// Listar pedidos de amizade pendentes recebidos
export const listarPedidosAmizadePendentes = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarioId = Number(req.params.id);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            res.status(400).json({ erro: "ID do usuário inválido." });
            return;
        }

        const [pedidos] = await pool.query(
            `SELECT a.id AS amizade_id, a.data_criacao,
                    u.id AS remetente_id, u.nome, u.email, u.foto_perfil
             FROM amizades a
             INNER JOIN usuarios u ON a.usuario_id = u.id
             WHERE a.amigo_id = ? AND a.status = 'pendente'`,
            [usuarioId]
        );

        res.status(200).json(pedidos);
    } catch (erro) {
        console.error("Erro ao listar pedidos pendentes:", erro);
        res.status(500).json({ erro: "Erro ao buscar pedidos de amizade." });
    }
};



// -------------------- POST -------------------- //

// Enviar pedido de amizade (POST)
export const enviarPedidoAmizade = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuario_id, amigo_id } = req.body;

        if (!Number.isInteger(usuario_id) || usuario_id <= 0 || !Number.isInteger(amigo_id) || amigo_id <= 0) {
            res.status(400).json({ erro: "IDs inválidos." });
            return;
        }

        if (usuario_id === amigo_id) {
            res.status(400).json({ erro: "Você não pode enviar um pedido de amizade para si mesmo." });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            `INSERT INTO amizades (usuario_id, amigo_id, status) 
             VALUES (?, ?, 'pendente')`,
            [usuario_id, amigo_id]
        );

        res.status(201).json({
            mensagem: "Pedido de amizade enviado com sucesso!",
            id: resultado.insertId
        });
    } catch (erro: any) {
        if (erro.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ erro: "Já existe um pedido ou amizade entre estes usuários." });
            return;
        }
        console.error("Erro ao enviar pedido de amizade:", erro);
        res.status(500).json({ erro: "Erro ao enviar pedido de amizade." });
    }
};



// -------------------- PUT -------------------- //

// Aceitar pedido de amizade (PUT)
export const aceitarPedidoAmizade = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID da amizade inválido." });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            `UPDATE amizades 
             SET status = 'aceito' 
             WHERE id = ? AND status = 'pendente'`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Pedido de amizade não encontrado ou já aceito." });
            return;
        }

        res.status(200).json({ mensagem: "Pedido de amizade aceito com sucesso!" });
    } catch (erro) {
        console.error("Erro ao aceitar pedido:", erro);
        res.status(500).json({ erro: "Erro ao aceitar pedido de amizade." });
    }
};



// -------------------- DELETE -------------------- //

// Desfazer amizade ou recusar/cancelar pedido (DELETE)
export const removerAmizade = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID da amizade inválido." });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            "DELETE FROM amizades WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Relação de amizade não encontrada." });
            return;
        }

        res.status(200).json({ mensagem: "Amizade/pedido removido com sucesso!" });
    } catch (erro) {
        console.error("Erro ao remover amizade:", erro);
        res.status(500).json({ erro: "Erro ao remover amizade." });
    }
};