import { Request, Response } from "express";
import pool from "../../config/database";

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