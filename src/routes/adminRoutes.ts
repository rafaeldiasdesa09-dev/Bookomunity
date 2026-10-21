import { Router, type Request, type Response, type NextFunction } from "express";
import pool from "../config/database";

type UsuarioSessao = {
    id: number;
    nome: string;
    email: string;
    perms: string;
};

declare module "express-session" {
    interface SessionData {
        usuario?: UsuarioSessao;
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

export const adminRoutes = Router();

/** Permite o acesso às rotas administrativas somente para administradores autenticados. */
async function exigirAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const usuario = req.session?.usuario;

    if (!usuario) {
        res.redirect("/login?erro=autenticacao");
        return;
    }

    try {
       
        const [resultado] = await pool.execute(
            "SELECT perms FROM usuarios WHERE id = ? LIMIT 1",
            [usuario.id]
        );
        const usuarios = resultado as Array<{ perms: string }>;

        if (!usuarios[0] || usuarios[0].perms?.toUpperCase() !== "ADMIN") {
            req.session.destroy(() => undefined);
            res.status(403).send("Acesso permitido somente para administradores.");
            return;
        }

        next();
    } catch (erro: unknown) {
        console.error("Erro ao verificar permissão administrativa:", erro);
        res.status(500).send("Não foi possível validar o acesso administrativo.");
        return;
    }
}

adminRoutes.use(exigirAdmin);

adminRoutes.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const [usuariosResult, usuariosTotalResult, postagensResult, clubesResult] =
            await Promise.all([
                pool.execute(
                    `SELECT id, nome, email, perms, data_criacao
                     FROM usuarios
                     ORDER BY id DESC
                     LIMIT 100`
                ),
                pool.execute("SELECT COUNT(*) AS total FROM usuarios"),
                pool.execute("SELECT COUNT(*) AS total FROM postagens"),
                pool.execute("SELECT COUNT(*) AS total FROM clubes")
            ]);

        const usuarios = usuariosResult[0] as UsuarioAdmin[];
        const totalUsuarios = (usuariosTotalResult[0] as Total[])[0]?.total ?? 0;
        const totalPostagens = (postagensResult[0] as Total[])[0]?.total ?? 0;
        const totalClubes = (clubesResult[0] as Total[])[0]?.total ?? 0;

        res.render("admin", {
            usuario: req.session.usuario,
            usuarios,
            totalUsuarios,
            totalPostagens,
            totalClubes
        });
    } catch (erro: unknown) {
        console.error("Erro ao carregar o painel administrativo:", erro);
        res.status(500).send("Não foi possível carregar o painel administrativo.");
    }
});


adminRoutes.get("/usuarios", async (_req: Request, res: Response): Promise<void> => {
    try {
        const [resultado] = await pool.execute(
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
});


adminRoutes.patch(
    "/usuarios/:id/perms",
    async (req: Request, res: Response): Promise<void> => {
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

        if (req.session.usuario?.id === id && perms !== "ADMIN") {
            res.status(400).json({ mensagem: "Não é possível remover sua própria permissão de administrador." });
            return;
        }

        try {
            const [usuarioEncontrado] = await pool.execute(
                "SELECT id FROM usuarios WHERE id = ? LIMIT 1",
                [id]
            );

            if ((usuarioEncontrado as Array<{ id: number }>).length === 0) {
                res.status(404).json({ mensagem: "Usuário não encontrado." });
                return;
            }

            await pool.execute(
                "UPDATE usuarios SET perms = ? WHERE id = ?",
                [perms, id]
            );

            res.json({ mensagem: "Permissão atualizada.", id, perms });
        } catch (erro: unknown) {
            console.error("Erro ao atualizar permissão de usuário:", erro);
            res.status(500).json({ mensagem: "Não foi possível atualizar a permissão." });
        }
    }
);

export default adminRoutes;
