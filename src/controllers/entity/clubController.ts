import { Request, Response } from "express";
import pool from "../../config/database";
import { ResultSetHeader } from "mysql2";

export async function criarClubeGenerico() {
    try {
        const [clubesExistentes]: any = await pool.query(
            `SELECT * FROM clubes WHERE nome = ?`, 
            ["all"]
        );

        if (clubesExistentes.length > 0) {
            console.log("O clube 'all' já existe:", clubesExistentes[0]);
            return clubesExistentes[0];
        }

        const [clube_og] = await pool.query<ResultSetHeader>(
            `INSERT INTO clubes (nome, descricao, criador_id) VALUES (?, ?, ?)`, 
            ["all", "grupo comum a todos", 1]
        );

        console.log("Clube 'all' criado com sucesso!");
        return clube_og;

    } catch (e) {
        console.error("\n Erro ao gerenciar o clube genérico: \n", e);
    }
}



// -------------------- GET -------------------- //

// Listar tudo
export const listarClubes = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [clubes] = await pool.query(
            `SELECT c.*, u.nome AS nome_criador
             FROM clubes c
             LEFT JOIN usuarios u ON c.criador_id = u.id`
        );

        res.status(200).json(clubes);
    } catch (erro) {
        console.error("Erro ao listar clubes:", erro);
        res.status(500).json({ erro: "Erro ao buscar clubes." });
    }
};



// Buscar clube existente por ID
export const buscarClubePorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.query(
            `SELECT c.*, u.nome AS nome_criador
             FROM clubes c
             LEFT JOIN usuarios u ON c.criador_id = u.id
             WHERE c.id = ?`,
            [id]
        );

        const clubes = resultado as Array<{ id: number }>;

        if (clubes.length === 0) {
            res.status(404).json({ erro: "Clube não encontrado." });
            return;
        }

        res.status(200).json(clubes[0]);
    } catch (erro) {
        console.error("Erro ao buscar clube:", erro);
        res.status(500).json({ erro: "Erro ao buscar clube." });
    }
};



// -------------------- POST -------------------- //

// Criar novo clube (POST)
export const criarClube = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nome, descricao, imagem, criador_id } = req.body;

        if (!nome || !criador_id) {
            res.status(400).json({ erro: "Os campos 'nome' e 'criador_id' são obrigatórios." });
            return;
        }

        if (!Number.isInteger(criador_id) || criador_id <= 0) {
            res.status(400).json({ erro: "ID do criador inválido." });
            return;
        }

        const data_criacao = new Date();

        const [resultado] = await pool.query<ResultSetHeader>(
            `INSERT INTO clubes (nome, descricao, imagem, criador_id, data_criacao) 
             VALUES (?, ?, ?, ?, ?)`,
            [nome, descricao || null, imagem || null, criador_id, data_criacao]
        );

        res.status(201).json({
            mensagem: "Clube cadastrado com sucesso!",
            id: resultado.insertId,
            nome,
            criador_id,
            data_criacao
        });
    } catch (erro) {
        console.error("Erro ao criar clube:", erro);
        res.status(500).json({ erro: "Erro ao cadastrar clube." });
    }
};



// -------------------- PUT -------------------- //

// Atualizar clube existente (PUT)
export const atualizarClube = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const { nome, descricao, imagem } = req.body;

        if (!nome) {
            res.status(400).json({ erro: "O campo 'nome' é obrigatório." });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            `UPDATE clubes 
             SET nome = ?, descricao = ?, imagem = ? 
             WHERE id = ?`,
            [nome, descricao || null, imagem || null, id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Clube não encontrado." });
            return;
        }

        res.status(200).json({ mensagem: "Clube atualizado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao atualizar clube:", erro);
        res.status(500).json({ erro: "Erro ao atualizar clube." });
    }
};



// -------------------- DELETE -------------------- //

// Deletar clube (DELETE)
export const deletarClube = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            "DELETE FROM clubes WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Clube não encontrado." });
            return;
        }

        res.status(200).json({ mensagem: "Clube deletado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao deletar clube:", erro);
        res.status(500).json({ erro: "Erro ao deletar clube." });
    }
};