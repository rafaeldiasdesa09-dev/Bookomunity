import { Request, Response } from "express";
import pool from "../../../config/database";
import { ResultSetHeader } from "mysql2";



// -------------------- GET -------------------- //

// Listar membros de um clube
export const listarMembrosClube = async (req: Request, res: Response): Promise<void> => {
    try {
        const idClube = Number(req.params.id);

        if (!Number.isInteger(idClube) || idClube <= 0) {
            res.status(400).json({ erro: "ID do clube inválido." });
            return;
        }

        const [membros] = await pool.execute(
            `SELECT m.usuario_id, m.clube_id, m.papel, m.data_entrada, 
                    u.nome, u.email, u.foto_perfil, u.bio 
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



// -------------------- POST -------------------- //

// Adicionar membro ao clube / Entrar no clube (POST)
export const adicionarMembroClube = async (req: Request, res: Response): Promise<void> => {
    try {
        const clube_id = Number(req.params.id);
        const { usuario_id, papel } = req.body;

        if (!Number.isInteger(clube_id) || clube_id <= 0 || !Number.isInteger(usuario_id) || usuario_id <= 0) {
            res.status(400).json({ erro: "IDs inválidos." });
            return;
        }

        const cargo = papel || "membro";
        const data_entrada = new Date();

        await pool.execute<ResultSetHeader>(
            `INSERT INTO membros_clube (usuario_id, clube_id, papel, data_entrada) 
             VALUES (?, ?, ?, ?)`,
            [usuario_id, clube_id, cargo, data_entrada]
        );

        res.status(201).json({ mensagem: "Membro adicionado ao clube com sucesso!" });
    } catch (erro: any) {
        // Trata erro de chave duplicada (caso o usuário já seja membro)
        if (erro.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ erro: "Este usuário já é membro deste clube." });
            return;
        }
        console.error("Erro ao adicionar membro:", erro);
        res.status(500).json({ erro: "Erro ao adicionar membro ao clube." });
    }
};



// -------------------- PUT -------------------- //

// Atualizar o papel de um membro no clube (PUT)
export const atualizarPapelMembro = async (req: Request, res: Response): Promise<void> => {
    try {
        const clube_id = Number(req.params.id);
        const usuario_id = Number(req.params.usuarioId);
        const { papel } = req.body;

        if (!Number.isInteger(clube_id) || clube_id <= 0 || !Number.isInteger(usuario_id) || usuario_id <= 0) {
            res.status(400).json({ erro: "IDs inválidos." });
            return;
        }

        if (!papel) {
            res.status(400).json({ erro: "O campo 'papel' é obrigatório." });
            return;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            `UPDATE membros_clube 
             SET papel = ? 
             WHERE clube_id = ? AND usuario_id = ?`,
            [papel, clube_id, usuario_id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Membro ou clube não encontrado." });
            return;
        }

        res.status(200).json({ mensagem: "Papel do membro atualizado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao atualizar papel do membro:", erro);
        res.status(500).json({ erro: "Erro ao atualizar papel do membro." });
    }
};



// -------------------- DELETE -------------------- //

// Remover membro do clube / Sair do clube (DELETE)
export const removerMembroClube = async (req: Request, res: Response): Promise<void> => {
    try {
        const clube_id = Number(req.params.id);
        const usuario_id = Number(req.params.usuarioId);

        if (!Number.isInteger(clube_id) || clube_id <= 0 || !Number.isInteger(usuario_id) || usuario_id <= 0) {
            res.status(400).json({ erro: "IDs inválidos." });
            return;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            `DELETE FROM membros_clube 
             WHERE clube_id = ? AND usuario_id = ?`,
            [clube_id, usuario_id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Membro não encontrado neste clube." });
            return;
        }

        res.status(200).json({ mensagem: "Membro removido do clube com sucesso!" });
    } catch (erro) {
        console.error("Erro ao remover membro:", erro);
        res.status(500).json({ erro: "Erro ao remover membro do clube." });
    }
};