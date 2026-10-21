
import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import pool from "../config/database";

const router = Router();

// Criar a pasta de uploads caso ela ainda não exista
const pastaUploads = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, { recursive: true });
}

// Configuração do armazenamento das fotos
const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, pastaUploads);
    },

    filename: (_req, file, callback) => {
        const extensao = path.extname(file.originalname).toLowerCase();
        const nomeArquivo =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`;

        callback(null, nomeArquivo);
    }
});

// Receber somente imagens permitidas
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, file, callback) => {
        const extensoesPermitidas = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif"
        ];

        const extensao = path.extname(file.originalname).toLowerCase();

        if (
            !extensoesPermitidas.includes(extensao) ||
            !file.mimetype.startsWith("image/")
        ) {
            return callback(
                new Error("Envie uma imagem JPG, PNG, WEBP ou GIF.")
            );
        }

        callback(null, true);
    }
});

// POST /api/registro
router.post(
    "/registro",
    upload.single("foto"),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const nome = String(req.body.nome || "").trim();
            const email = String(req.body.email || "")
                .trim()
                .toLowerCase();
            const senha = String(req.body.senha || "");

            // Validar os campos obrigatórios
            if (!nome || !email || !senha) {
                res.redirect("/registro?erro=dados");
                return;
            }

            if (nome.length > 100 || email.length > 254) {
                res.redirect("/registro?erro=dados");
                return;
            }

            if (senha.length < 6) {
                res.redirect("/registro?erro=dados");
                return;
            }

            // O bcrypt considera no máximo 72 bytes da senha
            if (Buffer.byteLength(senha, "utf8") > 72) {
                res.redirect("/registro?erro=senha");
                return;
            }

            // Verificar se o e-mail já está cadastrado
            const [resultado] = await pool.execute(
                "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
                [email]
            );

            const usuarios = resultado as Array<{ id: number }>;

            if (usuarios.length > 0) {
                res.redirect("/registro?erro=email");
                return;
            }

            // Criptografar a senha antes de salvar
            const senhaHash = await bcrypt.hash(senha, 12);

            // Caminho da foto ou NULL, caso não seja enviada
            const fotoPerfil = req.file
                ? `/uploads/${req.file.filename}`
                : null;

            // Salvar o novo usuário no MySQL
            await pool.execute(
                `INSERT INTO usuarios
                    (nome, email, senha, foto_perfil, bio, perms, data_criacao)
                 VALUES (?, ?, ?, ?, NULL, 'USER', CURRENT_TIMESTAMP)`,
                [nome, email, senhaHash, fotoPerfil]
            );

            // Redirecionar para a tela de login
            res.redirect("/login?sucesso=registro");
        } catch (erro: unknown) {
            console.error("Erro ao registrar usuário:", erro);

            // Tratar e-mail duplicado, inclusive em cadastros simultâneos
            if (
                typeof erro === "object" &&
                erro !== null &&
                "code" in erro &&
                erro.code === "ER_DUP_ENTRY"
            ) {
                res.redirect("/registro?erro=email");
                return;
            }

            res.status(500).send(
                "Não foi possível criar sua conta. Verifique o servidor e tente novamente."
            );
        }
    }
);


router.post(
    "/login",
    async (req: Request, res: Response): Promise<void> => {
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

            const [resultado] = await pool.execute(
                `SELECT id, nome, email, senha, perms
                 FROM usuarios
                 WHERE email = ?
                 LIMIT 1`,
                [email]
            );

            const usuarios = resultado as Array<{
                id: number;
                nome: string;
                email: string;
                senha: string;
                perms: string;
            }>;

            if (usuarios.length === 0) {
                res.status(401).json({
                    mensagem: "E-mail ou senha inválidos."
                });
                return;
            }


        } catch (erro) {
            console.error("Erro no login:", erro);

            res.status(500).json({
                mensagem: "Erro interno ao realizar login."
            });
        }
    }
);


// Exportar o roteador corretamente
export default router;
