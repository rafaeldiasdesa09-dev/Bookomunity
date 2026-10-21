import { Router, Request, Response } from "express";
import pool from "../config/database";

const router = Router();

//listar todos os usuários

router.get("/usuarios", async (_req: Request, res: Response) => {
    try {
        const [usuarios] = await pool.execute(
            `SELECT id, nome, email, foto_perfil, bio, perms, data_criacao
             FROM usuarios`
        );
        res.status(200).json(usuarios);
    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
        res.status(500).json({ erro: "Erro ao buscar usuários." });
    }
});

//Buscar os usuários existentes por ID

router.get("/usuarios/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.execute(
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
});

// Listar todos os livros 

router.get("/livros", async (_req: Request, res: Response) => {
    try {
    const [livros] = await pool.execute(
         "SELECT * FROM livros"
        );

     res.status(200).json(livros);
    } catch (erro) {
      console.error("Erro ao listar livros:", erro);
    res.status(500).json({ erro: "Erro ao buscar livros." });
    }
});

router.get("/livro/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido"});
            return;
        }

        const [resultado] = await pool.execute(
            "SELECT * FROM livros WHERE id = ?",
            [id]
        );
    
        const livros = resultado as Array<{ id: number }>;

        if (livros.length === 0) {
            res.status(404).json({ erro: "Livro não encontrado." });
            return;
        }

        res.status(200).json(livros[0]);
    } catch (erro) {
        console.error("Erro ao buscar livro:", erro);
        res.status(500).json({ erro: "Erro ao buscar livro." });
    }
});

// Listar clubes
router.get("/clubes", async (_req: Request, res: Response) => {
    try {
        const [clubes] = await pool.execute(
            `SELECT c.*, u.nome AS nome_criador
             FROM clubes c
             LEFT JOIN usuarios u ON c.criador_id = u.id`
        );

        res.status(200).json(clubes);
    } catch (erro) {
        console.error("Erro ao listar clubes:", erro);
        res.status(500).json({ erro: "Erro ao buscar clubes." });
    }
});

// Busca os clube pela ID
router.get("/clubes/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.execute(
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
});

// Isso vai listar postagens com informações relacionadas
router.get("/postagens", async (_req: Request, res: Response) => {
    try {
        const [postagens] = await pool.execute(
            `SELECT
                p.*,
                u.nome AS nome_usuario,
                c.nome AS nome_clube,
                l.titulo AS titulo_livro
             FROM postagens p
             LEFT JOIN usuarios u ON p.usuario_id = u.id
             LEFT JOIN clubes c ON p.clube_id = c.id
             LEFT JOIN livros l ON p.livro_id = l.id
             ORDER BY p.data_criacao DESC`
        );

        res.status(200).json(postagens);
    } catch (erro) {
        console.error("Erro ao listar postagens:", erro);
        res.status(500).json({ erro: "Erro ao buscar postagens." });
    }
});

// Buscar postagem por ID
router.get("/postagens/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido." });
            return;
        }

        const [resultado] = await pool.execute(
            `SELECT
                p.*,
                u.nome AS nome_usuario,
                c.nome AS nome_clube,
                l.titulo AS titulo_livro
             FROM postagens p
             LEFT JOIN usuarios u ON p.usuario_id = u.id
             LEFT JOIN clubes c ON p.clube_id = c.id
             LEFT JOIN livros l ON p.livro_id = l.id
             WHERE p.id = ?`,
            [id]
        );

        const postagens = resultado as Array<{ id: number }>;

        if (postagens.length === 0) {
            res.status(404).json({ erro: "Postagem não encontrada." });
            return;
        }

        res.status(200).json(postagens[0]);
    } catch (erro) {
        console.error("Erro ao buscar postagem:", erro);
        res.status(500).json({ erro: "Erro ao buscar postagem." });
    }
});

//Para API recomendar os livros 

router.get("/recomendacoes", async (_req: Request, res: Response) => {
    try {
        const [recomendacoes] = await pool.execute(
            `SELECT
                r.*,
                u.nome AS nome_usuario,
                l.titulo AS titulo_livro,
                p.titulo AS titulo_postagem
             FROM recomendacao_livros r
             LEFT JOIN usuarios u ON r.usuario_id = u.id
             LEFT JOIN livros l ON r.livro_id = l.id
             LEFT JOIN postagens p ON r.postagem_id = p.id
             ORDER BY r.data_criacao DESC`
        );

        res.status(200).json(recomendacoes);
    } catch (erro) {
        console.error("Erro ao listar recomendações:", erro);
        res.status(500).json({ erro: "Erro ao buscar recomendações." });
    }
});

// API DE MEMBROS DE CLUBES

router.get("/clubes/:id/membros", async (req: Request, res: Response) => {
    try {
        const idClube = Number(req.params.id);

        if (!Number.isInteger(idClube) || idClube <= 0) {
            res.status(400).json({ erro: "ID do clube inválido." });
            return;
        }

        const [membros] = await pool.execute(
            `SELECT
                m.usuario_id,
                m.clube_id,
                m.papel,
                m.data_entrada,
                u.nome,
                u.foto_perfil
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
});

// API DE COMENTÁRIOS

router.get(
    "/postagens/:id/comentarios",
    async (req: Request, res: Response) => {
        try {
            const idPostagem = Number(req.params.id);

            if (!Number.isInteger(idPostagem) || idPostagem <= 0) {
                res.status(400).json({ erro: "ID da postagem inválido." });
                return;
            }

            const [comentarios] = await pool.execute(
                `SELECT
                    c.*,
                    u.nome AS nome_usuario,
                    u.foto_perfil
                 FROM comentarios c
                 INNER JOIN usuarios u ON c.usuario_id = u.id
                 WHERE c.postagem_id = ?
                 ORDER BY c.data_criacao ASC`,
                [idPostagem]
            );

            res.status(200).json(comentarios);
        } catch (erro) {
            console.error("Erro ao listar comentários:", erro);
            res.status(500).json({ erro: "Erro ao buscar comentários." });
        }
    }
);

// API DE CURTIDAS

// Conta as curtidas de uma postagem

router.get(
    "/postagens/:id/curtidas",
    async (req: Request, res: Response) => {
        try {
            const idPostagem = Number(req.params.id);

            if (!Number.isInteger(idPostagem) || idPostagem <= 0) {
                res.status(400).json({ erro: "ID da postagem inválido." });
                return;
            }

            const [resultado] = await pool.execute(
                `SELECT COUNT(*) AS total
                 FROM curtidas
                 WHERE postagem_id = ?`,
                [idPostagem]
            );

            res.status(200).json(resultado);
        } catch (erro) {
            console.error("Erro ao contar curtidas:", erro);
            res.status(500).json({ erro: "Erro ao buscar curtidas." });
        }
    }
);

export default router;