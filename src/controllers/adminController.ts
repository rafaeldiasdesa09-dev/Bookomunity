import { Request, Response } from "express";
import pool from "../config/database";
import { ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
import { consoleContent } from "../types/variables";

async function criarAdmin() {
    try {
        const senha = await bcrypt.hash("admin123", 10)

        const [usuario] = await pool.query<ResultSetHeader>(`
            INSERT INTO usuarios (nome, email, senha, perms)
            VALUES (?, ?, ?, ?)`, ['admin', 'admin@bookomunity.com', senha, 'ADMIN'])
        
        const [admin]: any = await pool.query(`SELECT email, senha FROM usuarios WHERE perms='ADMIN'`)

        console.log("Administrador criado, informações:", admin)

    } catch {
        const [admin]: any = await pool.query(`SELECT email, senha FROM usuarios WHERE perms='ADMIN'`)
        console.log("Administrador presente:", admin)
    }
}



type UsuarioAdmin = {
    id: number;
    nome: string;
    email: string;
    perms: string;
    data_criacao: Date | string | null;
};

type Total = { total: number };

export const obterConsole = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({'success': true, 'data': consoleContent})
    } catch(e) {
        console.error("Erro ao carregar console:", e);
        res.status(500).json({ erro: "Erro ao carregar console." });        
    }
}

export const obterEstatisticasPainel = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [resultado] = await pool.query(`
            SELECT 
                (SELECT COUNT(id) FROM usuarios) AS total_usuarios,
                (SELECT COUNT(id) FROM livros) AS total_livros,
                (SELECT COUNT(id) FROM clubes) AS total_clubes,
                (SELECT COUNT(id) FROM postagens) AS total_postagens,
                (SELECT COUNT(id) FROM recomendacao_livros) AS total_recomendacoes,
                (SELECT COUNT(usuario_id) FROM membros_clube) AS total_membros_clube,
                (SELECT COUNT(id) FROM comentarios) AS total_comentarios,
                (SELECT COUNT(usuario_id) FROM curtidas) AS total_curtidas,
                (SELECT COUNT(id) FROM mensagens_diretas) AS total_mensagens
        `);

        const estatisticas = (resultado as any[])[0];

        res.status(200).json(estatisticas);
    } catch (erro) {
        console.error("Erro ao buscar estatísticas do painel:", erro);
        res.status(500).json({ erro: "Erro ao carregar estatísticas." });
    }
};

export const carregarPainelAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const [usuariosResult, usuariosTotalResult, postagensResult, clubesResult] =
            await Promise.all([
                pool.query(
                    `SELECT id, nome, email, perms, data_criacao
                     FROM usuarios
                     ORDER BY id DESC
                     LIMIT 100`
                ),
                pool.query("SELECT COUNT(*) AS total FROM usuarios"),
                pool.query("SELECT COUNT(*) AS total FROM postagens"),
                pool.query("SELECT COUNT(*) AS total FROM clubes")
            ]);

        const usuarios = usuariosResult[0] as UsuarioAdmin[];
        const totalUsuarios = (usuariosTotalResult[0] as Total[])[0]?.total ?? 0;
        const totalPostagens = (postagensResult[0] as Total[])[0]?.total ?? 0;
        const totalClubes = (clubesResult[0] as Total[])[0]?.total ?? 0;

        res.render("admin", {
            usuario: req.session.userName,
            usuarios,
            totalUsuarios,
            totalPostagens,
            totalClubes
        });
    } catch (erro: unknown) {
        console.error("Erro ao carregar o painel administrativo:", erro);
        res.status(500).send("Não foi possível carregar o painel administrativo.");
    }
};



export const listarUsuariosAdmin = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [resultado] = await pool.query(
            `SELECT id, nome, email, perms, data_criacao
             FROM usuarios
             ORDER BY id DESC
             LIMIT 100`
        );
        res.json({ usuarios: resultado as UsuarioAdmin[] });
    } catch (erro: unknown) {
        console.error("Erro ao listar usuários no painel administrativo:", erro);
        res.status(500).json({ mensagem: "Não foi possível listar os usuários." });
    }
};



export const atualizarPermissaoUsuario = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const perms = String(req.body?.perms ?? "").trim().toUpperCase();

    if (!Number.isSafeInteger(id) || id <= 0) {
        res.status(400).json({ mensagem: "Identificador de usuário inválido." });
        return;
    }

    if (perms !== "USER" && perms !== "ADMIN") {
        res.status(400).json({ mensagem: "A permissão deve ser USER ou ADMIN." });
        return;
    }

    if (req.session.userId === id && perms !== "ADMIN") {
        res.status(400).json({ mensagem: "Não é possível remover sua própria permissão de administrador." });
        return;
    }

    try {
        const [usuarioEncontrado] = await pool.query(
            "SELECT id FROM usuarios WHERE id = ? LIMIT 1",
            [id]
        );

        if ((usuarioEncontrado as Array<{ id: number }>).length === 0) {
            res.status(404).json({ mensagem: "Usuário não encontrado." });
            return;
        }

        await pool.query(
            "UPDATE usuarios SET perms = ? WHERE id = ?",
            [perms, id]
        );

        res.json({ mensagem: "Permissão atualizada.", id, perms });
    } catch (erro: unknown) {
        console.error("Erro ao atualizar permissão de usuário:", erro);
        res.status(500).json({ mensagem: "Não foi possível atualizar a permissão." });
    }
};



criarAdmin() // Criar usuário de admin no início da execução do código.