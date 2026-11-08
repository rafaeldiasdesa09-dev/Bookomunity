import { Request, Response } from "express";
import pool from "../../../config/database";
import { ResultSetHeader } from "mysql2";

// -------------------- GET -------------------- //

// Listar amigos do usuário logado
export const listarAmigos = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarioId = Number(req.session.userId);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            res.status(401).json({ erro: "Usuário não autenticado." });
            return;
        }

        const [amigos] = await pool.query(
            `SELECT
                a.id AS amizade_id,
                a.data_criacao,
                u.id AS usuario_id,
                u.nome_usuario,
                u.nome,
                u.email,
                u.foto_perfil,
                u.bio
            FROM amizades a
            INNER JOIN usuarios u ON (
                (a.usuario_id = ? AND a.amigo_id = u.id)
                OR
                (a.amigo_id = ? AND a.usuario_id = u.id)
            )
            WHERE (a.usuario_id = ? OR a.amigo_id = ?)
            AND a.status = 'aceito'`,
            [usuarioId, usuarioId, usuarioId, usuarioId]
        );

        res.status(200).json(amigos);
    } catch (erro) {
        console.error("Erro ao listar amigos:", erro);
        res.status(500).json({ erro: "Erro ao buscar amigos." });
    }
};

// Listar solicitações recebidas (onde o usuário logado é o destinatário/amigo_id)
export const listarPedidosAmizadePendentes = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const usuarioId = Number(req.session.userId);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            res.status(401).json({ erro: "Usuário não autenticado." });
            return;
        }

        const [pedidos] = await pool.query(
            `SELECT
                a.id AS amizade_id,
                a.data_criacao,
                u.id AS remetente_id,
                u.nome_usuario,
                u.nome,
                u.foto_perfil,
                u.bio
            FROM amizades a
            INNER JOIN usuarios u ON a.usuario_id = u.id
            WHERE a.amigo_id = ?
            AND a.status = 'pendente'`,
            [usuarioId]
        );

        res.status(200).json(pedidos);
    } catch (erro) {
        console.error("Erro ao listar pedidos:", erro);
        res.status(500).json({ erro: "Erro ao buscar solicitações." });
    }
};

// -------------------- POST -------------------- //

// Enviar pedido de amizade
export const enviarPedidoAmizade = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarioId = Number(req.session.userId);
        const amigoId = Number(req.body.amigo_id);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            res.status(401).json({ erro: "Usuário não autenticado." });
            return;
        }

        if (!Number.isInteger(amigoId) || amigoId <= 0) {
            res.status(400).json({ erro: "ID do destinatário inválido." });
            return;
        }

        if (usuarioId === amigoId) {
            res.status(400).json({ erro: "Você não pode enviar um pedido para si mesmo." });
            return;
        }

        const [usuario] = await pool.query<any[]>("SELECT id FROM usuarios WHERE id = ?", [amigoId]);
        if (usuario.length === 0) {
            res.status(404).json({ erro: "Usuário não encontrado." });
            return;
        }

        const [existente] = await pool.query<any[]>(
            `SELECT id, usuario_id, amigo_id, status FROM amizades
             WHERE (usuario_id = ? AND amigo_id = ?)
             OR (usuario_id = ? AND amigo_id = ?)`,
            [usuarioId, amigoId, amigoId, usuarioId]
        );

        if (existente.length > 0) {
            const relacao = existente[0];

            if (relacao.status === 'aceito') {
                res.status(400).json({ erro: "Vocês já são amigos." });
                return;
            }

            if (relacao.status === 'pendente' && relacao.usuario_id === amigoId) {
                await pool.query<ResultSetHeader>(
                    `UPDATE amizades SET status = 'aceito' WHERE id = ?`,
                    [relacao.id]
                );
                res.status(200).json({ mensagem: "Solicitação aceita automaticamente! Agora vocês são amigos." });
                return;
            }

            res.status(400).json({ erro: "Já existe uma solicitação pendente entre vocês." });
            return;
        }

        await pool.query<ResultSetHeader>(
            `INSERT INTO amizades (usuario_id, amigo_id, status) VALUES (?, ?, 'pendente')`,
            [usuarioId, amigoId]
        );

        res.status(201).json({ mensagem: "Solicitação de amizade enviada!" });
    } catch (erro) {
        console.error("Erro ao enviar pedido:", erro);
        res.status(500).json({ erro: "Erro ao enviar solicitação." });
    }
};

// -------------------- PUT -------------------- //

// Aceitar pedido recebido
export const aceitarPedidoAmizade = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const usuarioId = Number(req.session.userId);
        const amizadeId = Number(req.params.id);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            res.status(401).json({ erro: "Usuário não autenticado." });
            return;
        }

        if (!Number.isInteger(amizadeId) || amizadeId <= 0) {
            res.status(400).json({ erro: "ID da amizade inválido." });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            `UPDATE amizades
             SET status = 'aceito'
             WHERE id = ?
             AND amigo_id = ?
             AND status = 'pendente'`,
            [amizadeId, usuarioId]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({
                erro: "Solicitação não encontrada ou você não tem permissão para aceitá-la."
            });
            return;
        }

        res.status(200).json({
            mensagem: "Solicitação aceita com sucesso!"
        });
    } catch (erro) {
        console.error("Erro ao aceitar pedido:", erro);
        res.status(500).json({ erro: "Erro ao aceitar solicitação." });
    }
};

// -------------------- DELETE -------------------- //

// Remover amizade ou solicitação
export const removerAmizade = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const usuarioId = Number(req.session.userId);
        const amizadeId = Number(req.params.id);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            res.status(401).json({ erro: "Usuário não autenticado." });
            return;
        }

        if (!Number.isInteger(amizadeId) || amizadeId <= 0) {
            res.status(400).json({ erro: "ID da amizade inválido." });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            `DELETE FROM amizades
             WHERE id = ?
             AND (usuario_id = ? OR amigo_id = ?)`,
            [amizadeId, usuarioId, usuarioId]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({
                erro: "Amizade ou solicitação não encontrada."
            });
            return;
        }

        res.status(200).json({
            mensagem: "Operação realizada com sucesso!"
        });
    } catch (erro) {
        console.error("Erro ao remover amizade:", erro);
        res.status(500).json({ erro: "Erro ao remover amizade." });
    }
};