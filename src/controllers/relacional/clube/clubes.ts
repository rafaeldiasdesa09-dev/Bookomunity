import { Request, Response } from "express";
import Conexao from "../../../database/Conexao";

const conexao = Conexao;

export const listarClubes = async (req: Request, res: Response): Promise<void> => {
    try {
        const [clubes] = await conexao.execute(
            "SELECT * FROM clubes ORDER BY data_criacao DESC"
        );

        res.status(200).json({
            sucesso: true,
            clubes
        });
    } catch (erro) {
        console.error("Erro ao listar clubes:", erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar clubes."
        });
    }
};

export const buscarClubePorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                sucesso: false,
                mensagem: "ID do clube inválido."
            });
            return;
        }

        const [resultado] = await conexao.execute(
            "SELECT * FROM clubes WHERE id = ?",
            [id]
        );

        const clubes = resultado as any[];

        if (clubes.length === 0) {
            res.status(404).json({
                sucesso: false,
                mensagem: "Clube não encontrado."
            });
            return;
        }

        res.status(200).json({
            sucesso: true,
            clube: clubes[0]
        });
    } catch (erro) {
        console.error("Erro ao buscar clube:", erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao buscar clube."
        });
    }
};

export const criarClube = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nome, descricao, imagem, criador_id } = req.body;

        const [resultado] = await conexao.execute(
            `INSERT INTO clubes (nome, descricao, imagem, criador_id)
             VALUES (?, ?, ?, ?)`,
            [nome, descricao, imagem || null, criador_id]
        );

        const insertId = (resultado as any).insertId;

        res.status(201).json({
            sucesso: true,
            mensagem: "Clube criado com sucesso.",
            id: insertId
        });
    } catch (erro) {
        console.error("Erro ao criar clube:", erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao criar clube."
        });
    }
};

export const atualizarClube = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const { nome, descricao, imagem } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                sucesso: false,
                mensagem: "ID do clube inválido."
            });
            return;
        }

        const [resultado] = await conexao.execute(
            `UPDATE clubes
             SET nome = ?, descricao = ?, imagem = ?
             WHERE id = ?`,
            [nome, descricao, imagem || null, id]
        );

        if ((resultado as any).affectedRows === 0) {
            res.status(404).json({
                sucesso: false,
                mensagem: "Clube não encontrado."
            });
            return;
        }

        res.status(200).json({
            sucesso: true,
            mensagem: "Clube atualizado com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao atualizar clube:", erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao atualizar clube."
        });
    }
};

export const excluirClube = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                sucesso: false,
                mensagem: "ID do clube inválido."
            });
            return;
        }

        const [resultado] = await conexao.execute(
            "DELETE FROM clubes WHERE id = ?",
            [id]
        );

        if ((resultado as any).affectedRows === 0) {
            res.status(404).json({
                sucesso: false,
                mensagem: "Clube não encontrado."
            });
            return;
        }

        res.status(200).json({
            sucesso: true,
            mensagem: "Clube excluído com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao excluir clube:", erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao excluir clube."
        });
    }
};