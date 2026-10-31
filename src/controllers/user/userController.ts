import { Request, Response } from "express";
import pool from "../../config/database";
import { ResultSetHeader } from "mysql2";

// Listar tudo (incluindo o nome_usuario)
export const listarUsuarios = async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page || 0;

    try {
        const [usuarios] = await pool.query(
            `SELECT id, nome, nome_usuario, email, foto_perfil, bio, perms, data_criacao 
             FROM usuarios 
             WHERE id > ? 
             ORDER BY id 
             LIMIT 50`, 
            [page]
        );
        res.status(200).json(usuarios);
    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
        res.status(500).json({ erro: "Erro ao buscar usuários." });
    }
};

// Buscar usuário existente por ID (incluindo o nome_usuario)
export const buscarUsuarioPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.query(
            `SELECT id, nome, nome_usuario, email, foto_perfil, bio, perms, data_criacao
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

// Atualizar informações (incluindo suporte a nome_usuario)
export const atualizarBio = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { nome, nome_usuario, email, foto, bio } = req.body;

    if (nome === undefined && nome_usuario === undefined && email === undefined && foto === undefined && bio === undefined) {
        return res.status(400).json({ success: false, message: 'Nenhum campo foi fornecido para atualização.' });
    }

    const nomeUsuarioTratado = nome_usuario !== undefined 
        ? String(nome_usuario).trim().toLowerCase().replace(/\s+/g, "") 
        : undefined;

    try {
        const [update] = await pool.query<ResultSetHeader>(`
            UPDATE usuarios 
            SET nome = COALESCE(?, nome),
                nome_usuario = COALESCE(?, nome_usuario),
                email = COALESCE(?, email),
                foto_perfil = COALESCE(?, foto_perfil),
                bio = COALESCE(?, bio)
            WHERE id = ?
        `, [
            nome ?? null, 
            nomeUsuarioTratado ?? null, 
            email ?? null, 
            foto ?? null, 
            bio ?? null, 
            id
        ]);

        if (update.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        return res.json({ success: true, message: 'Usuário atualizado com sucesso!' });

    } catch (erro: any) {
        console.error("Erro ao atualizar usuário:", erro);

        if (erro && erro.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ success: false, message: 'Este e-mail ou nome de usuário já está em uso.' });
        }

        return res.status(500).json({ success: false, message: "Erro ao atualizar usuário." });
    }
};