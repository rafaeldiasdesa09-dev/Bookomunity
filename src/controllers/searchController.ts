import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import pool from "../config/database";

export const pesquisarDB = async (req: Request, res: Response): Promise<void> => {
    const filter = req.query.filter;
    const q = (req.query.q as string)?.trim() || '';
    
    const nome = req.session.userName;
    const foto = req.session.photo;
    const userId = req.session.userId;
    const userName = req.session.userName
    const sessionUserName = req.session.userName

    try {
        let pesquisa: any;

        if (filter === 'usuario') {
            if (q) {
                const termo_consult = `%${q}%`;
                [pesquisa] = await pool.query(`
                    SELECT nome, nome_usuario, foto_perfil, bio FROM usuarios WHERE nome LIKE ? AND PERMS != 'ADMIN' ORDER BY id LIMIT 20`, [termo_consult]);
            } else {
                [pesquisa] = await pool.query(`
                    SELECT nome, nome_usuario, foto_perfil, bio FROM usuarios WHERE PERMS != 'ADMIN' ORDER BY id LIMIT 20`);
            }

            } else if (filter === 'postagem') {
            if (q) {
                const termo_consult = `%${q}%`;
                [pesquisa] = await pool.query(`
                    SELECT 
                        p.*,
                        p.avaliacao AS avaliacao,
                        u.nome AS nome_exibicao, 
                        u.nome_usuario AS nome, 
                        u.foto_perfil, 
                        l.titulo AS titulo_livro, 
                        l.capa AS capa_livro,
                        (SELECT COUNT(*) FROM curtidas c WHERE c.postagem_id = p.id) AS curtidas,
                        (SELECT COUNT(*) FROM comentarios com WHERE com.postagem_id = p.id) AS comentarios,
                        (SELECT COUNT(*) FROM recomendacao_livros rec WHERE rec.postagem_id = p.id) AS livros_recomendados
                    FROM postagens p
                    LEFT JOIN usuarios u ON p.usuario_id = u.id
                    LEFT JOIN livros l ON p.livro_id = l.id
                    WHERE p.titulo LIKE ? AND p.clube_id = 1 
                    ORDER BY p.id DESC 
                    LIMIT 20`, [termo_consult]);
            } else {
                [pesquisa] = await pool.query(`
                    SELECT 
                        p.*, 
                        u.nome AS nome_exibicao, 
                        u.nome_usuario AS nome, 
                        u.foto_perfil, 
                        l.titulo AS titulo_livro, 
                        l.capa AS capa_livro,
                        (SELECT COUNT(*) FROM curtidas c WHERE c.postagem_id = p.id) AS curtidas,
                        (SELECT COUNT(*) FROM comentarios com WHERE com.postagem_id = p.id) AS comentarios,
                        (SELECT COUNT(*) FROM recomendacao_livros rec WHERE rec.postagem_id = p.id) AS livros_recomendados
                    FROM postagens p
                    LEFT JOIN usuarios u ON p.usuario_id = u.id
                    LEFT JOIN livros l ON p.livro_id = l.id
                    WHERE p.clube_id = 1 
                    ORDER BY p.id DESC 
                    LIMIT 20`);
            }

        } else if (filter === 'livro') {
            if (q) {
                const termo_consult = `%${q}%`;
                [pesquisa] = await pool.query(`
                    SELECT * FROM livros WHERE titulo LIKE ? ORDER BY id LIMIT 20`, [termo_consult]);
            } else {
                [pesquisa] = await pool.query(`
                    SELECT * FROM livros ORDER BY id LIMIT 20`);
            }

        } else {
            res.status(400).json({'success': false, 'message': 'Filtro enviado desconhecido:', filter});
        }

        return res.status(200).render('search', {
            dados: pesquisa, 
            nome, 
            foto, 
            type: filter, 
            userId, 
            isOwner: undefined, 
            page: req.path,
            userName,
            sessionUserName
        });

    } catch(e) {
        console.log("Erro ao pesquisar pelo banco de dados:", e);
        res.status(500).json({"success": false, "message": "Erro interno do servidor"});
    }
};