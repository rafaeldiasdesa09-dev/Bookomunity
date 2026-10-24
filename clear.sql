# Use para limpar todos os registros presentes no banco de dados.

USE bookomunity_db;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE usuarios;
TRUNCATE TABLE livros;
TRUNCATE TABLE clubes;
TRUNCATE TABLE comentarios;
TRUNCATE TABLE membros_clube;
TRUNCATE TABLE mensagens_diretas;
TRUNCATE TABLE postagens;
TRUNCATE TABLE recomendacao_livros;
TRUNCATE TABLE curtidas;

SET FOREIGN_KEY_CHECKS = 1;

-- Consulta única trazendo todas as contagens com aliases
SELECT 
    (SELECT COUNT(id) FROM usuarios) AS total_usuarios,
    (SELECT COUNT(id) FROM livros) AS total_livros,
    (SELECT COUNT(id) FROM clubes) AS total_clubes,
    (SELECT COUNT(id) FROM postagens) AS total_postagens,
    (SELECT COUNT(id) FROM recomendacao_livros) AS total_recomendacoes,
    (SELECT COUNT(usuario_id) FROM membros_clube) AS total_membros_clube,
    (SELECT COUNT(id) FROM comentarios) AS total_comentarios,
    (SELECT COUNT(usuario_id) FROM curtidas) AS total_curtidas,
    (SELECT COUNT(id) FROM mensagens_diretas) AS total_mensagens;