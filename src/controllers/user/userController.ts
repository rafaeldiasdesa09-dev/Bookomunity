import { Request, Response } from "express";
import pool from "../../config/database";

// Listar tudo
export const listarUsuarios = async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page

    try {
        const [usuarios] = await pool.query(`SELECT * FROM usuarios WHERE id > ? ORDER BY id LIMIT 50`, [page]);
        res.status(200).json(usuarios);
    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
        res.status(500).json({ erro: "Erro ao buscar usuários." });
    }
};

// Buscar usuário existente por ID
export const buscarUsuarioPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.query(
            `SELECT id, nome, email, foto_perfil, bio, perms, data_criacao
             FROM usuarios
             WHERE id = ?`,
            [id]
        );

        const usuarios = resultado as Array<{ id: number }>;

        if (usuarios.length === 0) {
            res.status(404).json({ erro: "Usuário não encontrado." });
            return;
        }

        res.status(200).json(usuarios[0]);
    } catch (erro) {
        console.error("Erro ao buscar usuário:", erro);
        res.status(500).json({ erro: "Erro ao buscar usuário." });
    }
};