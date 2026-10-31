import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../../config/database";

export const registrarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const nome = String(req.body.nome || "").trim();
        const nomeUsuario = String(req.body.nome_usuario || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");
            
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();
        const senha = String(req.body.senha || "");

        if (!nome || !nomeUsuario || !email || !senha) {
            res.redirect("/registro?erro=dados");
            return;
        }

        if (nome.length > 100 || nomeUsuario.length > 50 || email.length > 254) {
            res.redirect("/registro?erro=dados");
            return;
        }

        if (senha.length < 6) {
            res.redirect("/registro?erro=dados");
            return;
        }

        if (Buffer.byteLength(senha, "utf8") > 72) {
            res.redirect("/registro?erro=senha");
            return;
        }

        const [resultado] = await pool.query(
            "SELECT id FROM usuarios WHERE email = ? OR nome_usuario = ? LIMIT 1",
            [email, nomeUsuario]
        );

        const usuarios = resultado as Array<{ id: number }>;

        if (usuarios.length > 0) {
            res.redirect("/registro?erro=email_ou_usuario");
            return;
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        const fotoPerfil = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        await pool.query(
            `INSERT INTO usuarios
                (nome, nome_usuario, email, senha, foto_perfil, bio, perms, data_criacao)
             VALUES (?, ?, ?, ?, ?, NULL, 'USER', CURRENT_TIMESTAMP)`,
            [nome, nomeUsuario, email, senhaHash, fotoPerfil]
        );

        res.redirect("/login?sucesso=registro");
    } catch (erro: unknown) {
        console.error("Erro ao registrar usuário:", erro);

        if (
            typeof erro === "object" &&
            erro !== null &&
            "code" in erro &&
            (erro as { code: string }).code === "ER_DUP_ENTRY"
        ) {
            res.redirect("/registro?erro=email_ou_usuario");
            return;
        }

        res.status(500).send(
            "Não foi possível criar sua conta. Verifique o servidor e tente novamente."
        );
    }
};

export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();

        const senha = String(req.body.senha || "");
    
        if (!email || !senha) {
            res.status(400).json({
                mensagem: "Informe o e-mail e a senha."
            });
            return;
        }

        const [resultado] = await pool.query(
            `SELECT id, nome, nome_usuario, email, senha, perms, foto_perfil
             FROM usuarios
             WHERE email = ?
             LIMIT 1`,
            [email]
        );

        const usuarios = resultado as Array<{
            id: number;
            nome: string;
            nome_usuario: string;
            email: string;
            senha: string;
            perms: string;
            foto_perfil: string;
        }>;

        if (usuarios.length === 0) {
            res.status(401).json({
                mensagem: "E-mail ou senha inválidos."
            });
            return;
        }
        
        const usuario = usuarios[0];
        if (usuario === undefined) {
            res.status(401).json({
                mensagem: "Informações do usuário não encontradas."
            });
            return;
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            res.status(401).json({
                mensagem: "E-mail ou senha inválidos."
            });
            return;
        }

        if (usuario !== undefined) {
            req.session.admin = usuario.perms !== "USER";
            req.session.userId = usuario.id;
            req.session.userName = usuario.nome;
            req.session.email = usuario.email;
            req.session.photo = usuario.foto_perfil;
        }

        if (req.session.admin === true) {
            res.redirect("/admin");
        } else {
            res.redirect("/explore");
        }

    } catch (erro) {
        console.error("Erro no login:", erro);

        res.status(500).json({
            mensagem: "Erro interno ao realizar login."
        });
    }
};

export const sairDoUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log("Erro ao sair da sessão:", err);
                return res.status(500).json({ mensagem: "Erro ao realizar logoff." });
            }
        });
        console.log("Sessão limpa");

        res.clearCookie('connect.sid');
        return res.redirect('/explore');
    } catch (erro) {
        console.error("Erro no logoff:", erro);

        res.status(500).json({
            mensagem: "Erro interno ao realizar logoff."
        });
    }
};