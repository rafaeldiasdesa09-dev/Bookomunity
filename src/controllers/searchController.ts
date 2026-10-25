import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import pool from "../config/database";

export const pesquisarDB = async (req: Request, res: Response) => {
    const filter = req.query.filter;
    const q = req.query.q || ''; // pesquisa
    const termo_consult = `%${q}%`;
    const nome = req.session.userName
    const foto = req.session.photo

    try {

        let pesquisa: any
        if (filter === 'usuario') {
            [pesquisa] = await pool.query(`
                SELECT nome, foto_perfil, bio FROM usuarios WHERE nome LIKE ? AND PERMS != 'ADMIN' ORDER BY id LIMIT 20`, [termo_consult]);

        } else if (filter === 'postagem') {
            [pesquisa] = await pool.query(`
                SELECT * FROM postagens WHERE titulo LIKE ? ORDER BY id LIMIT 20`, [termo_consult]);

        } else if (filter === 'livro') {
             [pesquisa] = await pool.query(`
                SELECT * FROM livros WHERE titulo LIKE ? ORDER BY id LIMIT 20`, [termo_consult]);

        } else {
            return res.status(400).json({'success': false, 'message': 'Filtro enviado desconhecido:', filter});
        }

        return res.status(200).render('search', {dados: pesquisa, nome: nome, foto: foto, type: filter})
    } catch(e) {
        console.log("Erro ao pesquisar pelo banco de dados:", e);
        return res.status(500).json({"success": false, "message": "Erro interno do servidor"});
    }
}