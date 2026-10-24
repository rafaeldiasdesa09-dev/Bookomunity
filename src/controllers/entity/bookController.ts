import { Request, Response } from "express";
import pool from "../../config/database";
import { ResultSetHeader } from "mysql2";



// -------------------- GET -------------------- //

// Listar tudo
export const listarLivros = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [livros] = await pool.execute("SELECT * FROM livros");
        res.status(200).json(livros);
    } catch (erro) {
        console.error("Erro ao listar livros:", erro);
        res.status(500).json({ erro: "Erro ao buscar livros." });
    }
};



// Buscar livro existente por ID
export const buscarLivroPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido" });
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
};



// -------------------- POST -------------------- //

// Criar novo livro (POST)
export const criarLivro = async (req: Request, res: Response): Promise<void> => {
    try {
        const { titulo, autor, isbn, descricao, genero, ano_publicacao, capa } = req.body;

        // Validação básica dos campos obrigatórios
        if (!titulo || !autor) {
            res.status(400).json({ erro: "Os campos 'titulo' e 'autor' são obrigatórios." });
            return;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            `INSERT INTO livros (titulo, autor, isbn, descricao, genero, ano_publicacao, capa) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [titulo, autor, isbn || null, descricao || null, genero || null, ano_publicacao || null, capa || null]
        );

        res.status(201).json({
            mensagem: "Livro cadastrado com sucesso!",
            id: resultado.insertId,
            titulo,
            autor
        });
    } catch (erro) {
        console.error("Erro ao criar livro:", erro);
        res.status(500).json({ erro: "Erro ao cadastrar livro." });
    }
};



// -------------------- PUT -------------------- //

// Atualizar livro existente (PUT)
export const atualizarLivro = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido" });
            return;
        }

        const { titulo, autor, isbn, descricao, genero, ano_publicacao, capa } = req.body;

        if (!titulo || !autor) {
            res.status(400).json({ erro: "Os campos 'titulo' e 'autor' são obrigatórios." });
            return;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            `UPDATE livros 
             SET titulo = ?, autor = ?, isbn = ?, descricao = ?, genero = ?, ano_publicacao = ?, capa = ? 
             WHERE id = ?`,
            [titulo, autor, isbn || null, descricao || null, genero || null, ano_publicacao || null, capa || null, id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Livro não encontrado." });
            return;
        }

        res.status(200).json({ mensagem: "Livro atualizado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao atualizar livro:", erro);
        res.status(500).json({ erro: "Erro ao atualizar livro." });
    }
};



// -------------------- DELETE -------------------- //

// Deletar livro (DELETE)
export const deletarLivro = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ erro: "ID inválido" });
            return;
        }

        const [resultado] = await pool.execute<ResultSetHeader>(
            "DELETE FROM livros WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Livro não encontrado." });
            return;
        }

        res.status(200).json({ mensagem: "Livro deletado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao deletar livro:", erro);
        res.status(500).json({ erro: "Erro ao deletar livro." });
    }
};