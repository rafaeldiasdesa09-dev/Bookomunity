USE bookomunity_db;

-- ==========================================
-- 1. INSERTS NA TABELA: usuarios (15 registros)
-- Senha padrão para todos: '123456' (Hash bcrypt com 10 salt rounds)
-- Hash gerado: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- ==========================================
INSERT INTO usuarios (nome, nome_usuario, email, senha, foto_perfil, bio, perms) VALUES
('Ana Clara Souza', 'anaclara', 'ana.souza@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 'Amante de romances históricos e fantasia épica.', 'USER'),
('Carlos Eduardo Lima', 'carlosedu', 'carlos.lima@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'Leitor compulsivo de ficção científica e tecnologia.', 'USER'),
('Beatriz Mendes', 'biatriz', 'beatriz.mendes@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 'Escrevo resenhas e estudo literatura clássica.', 'MOD'),
('Lucas Pereira', 'lucasp', 'lucas.pereira@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', 'Café, livros de suspense e muito mistério.', 'USER'),
('Mariana Costa', 'maricosta', 'mariana.costa@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', 'Apaixonada por poesia e biografias inspiradoras.', 'USER'),
('Gabriel Santos', 'gabriels', 'gabriel.santos@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7', 'Devorador de mangás e HQs.', 'USER'),
('Juliana Ribeiro', 'julianar', 'juliana.ribeiro@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1517841905240-472988babdf9', 'Moderadora do Clube de Leitura de Terror.', 'MOD'),
('Rafael Almeida', 'rafaelalmeida', 'rafael.almeida@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', 'Fascinado por livros de filosofia e história geral.', 'USER'),
('Fernanda Rocha', 'ferocha', 'fernanda.rocha@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', 'Amo literatura fantástica e universos mágicos.', 'USER'),
('Bruno Martins', 'brunom', 'bruno.martins@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61', 'Administrador da plataforma Bookomunity.', 'ADMIN'),
('Camila Azevedo', 'camilaz', 'camila.azevedo@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1', 'Leitora de romances contemporâneos e drama.', 'USER'),
('Thiago Barbosa', 'thiagob', 'thiago.barbosa@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea', 'Curioso por ciência de dados e livros técnicos.', 'USER'),
('Larissa Dias', 'larissadias', 'larissa.dias@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e', 'Colecionadora de edições especiais de livros.', 'USER'),
('Matheus Carvalho', 'matheuscarv', 'matheus.carvalho@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6', 'Entusiasta de literatura nacional e contos.', 'USER'),
('Patrícia Ramos', 'patiramos', 'patricia.ramos@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263', 'Apaixonada por romances policiais e thrillers.', 'USER');


-- ==========================================
-- 2. INSERTS NA TABELA: livros (15 registros)
-- ==========================================
INSERT INTO livros (titulo, autor, isbn, descricao, genero, ano_publicacao, capa) VALUES
('Dom Casmurro', 'Machado de Assis', '978-8535902792', 'A clássica história de Bentinho e Capitu e a eterna dúvida sobre a traição.', 'Romance / Literatura Brasileira', 1899, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'),
('O Senhor dos Anéis: A Sociedade do Anel', 'J.R.R. Tolkien', '978-8595084759', 'O início da jornada épica pela Terra-média para destruir o Um Anel.', 'Fantasia Épica', 1954, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('1984', 'George Orwell', '978-8535914849', 'Uma distopia marcante sobre vigilância governamental extrema e o Grande Irmão.', 'Ficção Científica / Distopia', 1949, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', '978-8595081512', 'Uma fábula poética e filosófica sobre amizade, amor e o sentido da vida.', 'Infantojuvenil / Fábula', 1943, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('Crime e Castigo', 'Fiódor Dostoiévski', '978-8572328002', 'Um jovem estudante enfrenta dilemas morais profundos após cometer um crime.', 'Romance Psicológico / Clássico', 1866, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6'),
('Orgulho e Preconceito', 'Jane Austen', '978-8525433299', 'Os atritos e o romance entre Elizabeth Bennet e Fitzwilliam Darcy.', 'Romance / Clássico', 1813, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090'),
('A Revolução dos Bichos', 'George Orwell', '978-8535909555', 'Uma sátira política onde animais expulsam os humanos de sua fazenda.', 'Sátira / Fábula Política', 1945, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73'),
('O Hobbit', 'J.R.R. Tolkien', '978-8595084742', 'A aventura de Bilbo Bolseiro rumo à Montanha Solitária.', 'Fantasia', 1937, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('Cem Anos de Solidão', 'Gabriel García Márquez', '978-8501012623', 'A saga da família Buendía na aldeia mítica de Macondo.', 'Realismo Mágico', 1967, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe'),
('O Código Da Vinci', 'Dan Brown', '978-8575420959', 'Um mistério de assassinatos e códigos ocultos que abala a história da arte.', 'Thriller / Suspense', 2003, 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6'),
('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', '978-8532530783', 'O início da jornada do jovem bruxo na Escola de Magia e Bruxaria de Hogwarts.', 'Fantasia', 1997, 'https://images.unsplash.com/photo-1618609378037-3bf448416629'),
('It: A Coisa', 'Stephen King', '978-8581050555', 'Um grupo de amigos enfrenta uma entidade aterrorizante na cidade de Derry.', 'Terror / Suspense', 1986, 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071'),
('A Menina que Roubava Livros', 'Markus Zusak', '978-8580575965', 'A trajetória de Liesel Meminger na Alemanha nazista narrada pela própria Morte.', 'Drama / Histórico', 2005, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da'),
('Sapiens: Uma Breve História da Humanidade', 'Yuval Noah Harari', '978-8535924800', 'Como a humanidade evoluiu de animais insignificantes para os dominadores do planeta.', 'História / Não-ficção', 2011, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('O Alquimista', 'Paulo Coelho', '978-8575427583', 'A jornada mística de um jovem pastor em busca de seu tesouro pessoal.', 'Ficção / Inspiracional', 1988, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61');

-- ==========================================
-- 3. INSERTS NA TABELA: postagens (15 registros)
-- usuario_id de 123 a 137, clube_id = 1
-- Avaliação apenas nos tipos 'RESENHA'
-- ==========================================
INSERT INTO postagens (tipo, titulo, conteudo, avaliacao, usuario_id, clube_id, livro_id) VALUES
('RESENHA', 'Uma obra-prima da literatura nacional', 'Machado de Assis constrói personagens profundos e cheios de nuances. Capitu é inesquecível!', 5.0, 123, 1, 1),
('DISCUSSAO', 'O Anel realmente corrompia quem o usava?', 'Queria abrir espaço para debatermos se a força de vontade pura poderia resistir ao Um Anel a longo prazo.', NULL, 124, 1, 2),
('COMUM', 'Qual foi o último livro que vocês leram neste mês?', 'Estou atualizando minhas metas de leitura e queria saber o que o pessoal do grupo tem recomendado!', NULL, 125, 1, NULL),
('RECOMENDACOES', 'Lista imperdível de distopias para iniciantes', 'Se você gostou de 1984, recomendo fortemente ler A Revolução dos Bichos e Admirável Mundo Novo logo em seguida.', NULL, 126, 1, NULL),
('RESENHA', 'Leitura tocante e cheia de simbolismos', 'O Pequeno Príncipe me fez enxergar o mundo com outros olhos. Um livro para ler em todas as fases da vida.', 5.0, 127, 1, 4),
('DISCUSSAO', 'A culpa de Raskólnikov em Crime e Castigo', 'Até que ponto a teoria de Raskólnikov justifica seus atos? O livro debate moralidade de forma fantástica.', NULL, 128, 1, 5),
('COMUM', 'Café e leitura combinam demais', 'Passando para desejar uma ótima tarde de leitura a todos os membros desta comunidade incrível!', NULL, 129, 1, NULL),
('RESENHA', 'Orgulho e Preconceito: Romance atemporal', 'Jane Austen traz diálogos inteligentes e uma crítica social refinada embalada em uma história de amor deliciosa.', 4.9, 130, 1, 6),
('RECOMENDACOES', 'Trilogias de fantasia épica para o fim de semana', 'Separamos aqui algumas recomendações rápidas para quem ama universos fantásticos e muita magia.', NULL, 131, 1, NULL),
('DISCUSSAO', 'O realismo mágico em Cem Anos de Solidão', 'Como vocês interpretam a chegada dos ciganos e os eventos fantásticos no meio do cotidiano de Macondo?', NULL, 132, 1, 9),
('RESENHA', 'Mistério frenético do início ao fim', 'O Código Da Vinci te prende de um jeito que é impossível largar antes do último capítulo.', 4.2, 133, 1, 10),
('RECOMENDACOES', 'Livros infantojuvenis que adultos também amam', 'Harry Potter continua sendo uma porta de entrada fantástica para o mundo da leitura.', NULL, 134, 1, NULL),
('RESENHA', 'O terror psicológico de Stephen King em It', 'Mais do que um palhaço assustador, o livro trata sobre a amizade na infância e os traumas que carregamos.', 4.4, 135, 1, 12),
('COMUM', 'Meta de leitura batida!', 'Consegui concluir meus 30 livros previstos para este ano. Muito feliz com a jornada literária!', NULL, 136, 1, NULL),
('RECOMENDACOES', 'Não-ficção essencial para entender a humanidade', 'Sapiens deveria ser leitura obrigatória nas escolas. Mente totalmente aberta sobre nossa história.', NULL, 137, 1, NULL);