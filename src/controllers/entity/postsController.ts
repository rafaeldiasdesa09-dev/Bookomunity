import { Request, Response } from "express";
import pool from "../../config/database";
import { ResultSetHeader } from "mysql2";



// -------------------- DELETE -------------------- //

export const deletarPostagem = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        const [postagem] = await pool.query<ResultSetHeader>(`
            DELETE FROM postagens WHERE id = ?`, [id]
        )

        if (postagem.affectedRows === 0) {
            return res.status(404).json({"success": false, "message": `Não existe nenhuma postagem com id = ${id}`})
        }

        return res.status(200).json({"success": true, "message": `Postagem com id = ${id} foi excluída com sucesso!`})

    } catch(e) {
        console.error("Erro ao deletar postagem:", e)
        res.status(500).json({"success": false, "message": "Erro interno do servidor"})
    }
}



// -------------------- PUT -------------------- //

export const atualizarPostagem = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const {titulo, conteudo, avaliacao} = req.body

        const [atualizacao] = await pool.query<ResultSetHeader>(`
            UPDATE postagens 
            SET 
            titulo = COALESCE(?, titulo), 
            conteudo = COALESCE(?, conteudo), 
            avaliacao = COALESCE(?, avaliacao), 
            data_atualizacao = NOW() 
            WHERE id = ?`, [titulo ?? null, conteudo ?? null, avaliacao ?? null, id]
        )

        if (atualizacao.affectedRows === 0) {
            return res.status(404).json({"success": false, "message": `Não existe nenhuma postagem com id = ${id}`})
        }

        return res.status(200).json({"success": true, "message": `Postagem com id = ${id} foi atualizada com sucesso!`})

    } catch(e) {
        console.error("Erro ao atualizar postagem:", e)
        res.status(500).json({"success": false, "message": "Erro interno do servidor"})
    }
}



// -------------------- POST -------------------- //

export const criarPostagem = async (req: Request, res: Response): Promise<void> => {
    try {
        const {tipo, titulo, conteudo, avaliacao} = req.body || null
        const usuario_id = Number(req.body.usuario_id)
        const livro_id = Number(req.body.livro_id)


        const [postagem] = await pool.query(
            `INSERT INTO postagens (tipo, titulo, conteudo, avaliacao, usuario_id, livro_id)
            values (?, ?, ?, ?, ?, ?)`, [tipo, titulo, conteudo, avaliacao, usuario_id, livro_id]
        )
        res.status(200).json(postagem)
    } catch(e) {
        console.error("Erro ao criar postagem:", e)
        res.status(500).json({"success": false, "message": "Erro interno do servidor"})
    }
}



// -------------------- GET -------------------- //

// Listar tudo
export const listarPostagens = async (_req: Request, res: Response): Promise<void> => {
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
};

// Buscar postagem existente por ID
export const buscarPostagemPorId = async (req: Request, res: Response): Promise<void> => {
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
};