-- ========================================================
-- 1. CRIAÇÃO DAS TABELAS
-- ========================================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(254) UNIQUE,
    senha VARCHAR(255),
    foto_perfil VARCHAR(255),
    bio TEXT,
    perms VARCHAR(20),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Livros
CREATE TABLE IF NOT EXISTS livros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200),
    autor VARCHAR(150),
    isbn VARCHAR(17),
    descricao TEXT,
    genero VARCHAR(100),
    ano_publicacao SMALLINT,
    capa VARCHAR(255)
);

-- Tabela de Clubes
CREATE TABLE IF NOT EXISTS clubes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT,
    imagem VARCHAR(255),
    criador_id INT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_clubes_criador FOREIGN KEY (criador_id) REFERENCES usuarios(id)
);

-- Tabela de Postagens
CREATE TABLE IF NOT EXISTS postagens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(20),
    titulo VARCHAR(200),
    conteudo TEXT,
    avaliacao DECIMAL(2,1),
    usuario_id INT,
    clube_id INT,
    livro_id INT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP(),
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_postagens_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_postagens_clube FOREIGN KEY (clube_id) REFERENCES clubes(id),
    CONSTRAINT fk_postagens_livro FOREIGN KEY (livro_id) REFERENCES livros(id)
);

-- Tabela de Recomendação de Livros
CREATE TABLE IF NOT EXISTS recomendacao_livros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    postagem_id INT,
    usuario_id INT,
    livro_id INT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP(),
    CONSTRAINT fk_recom_postagem FOREIGN KEY (postagem_id) REFERENCES postagens(id),
    CONSTRAINT fk_recom_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_recom_livro FOREIGN KEY (livro_id) REFERENCES livros(id)
);

-- Tabela de Membros de Clube
CREATE TABLE IF NOT EXISTS membros_clube (
    usuario_id INT,
    clube_id INT,
    papel VARCHAR(20),
    data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, clube_id),
    CONSTRAINT fk_membros_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_membros_clube FOREIGN KEY (clube_id) REFERENCES clubes(id)
);

-- Tabela de Comentários
CREATE TABLE IF NOT EXISTS comentarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conteudo TEXT,
    usuario_id INT,
    postagem_id INT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentarios_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_comentarios_postagem FOREIGN KEY (postagem_id) REFERENCES postagens(id)
);

-- Tabela de Curtidas
CREATE TABLE IF NOT EXISTS curtidas (
    usuario_id INT,
    postagem_id INT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, postagem_id),
    CONSTRAINT fk_curtidas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_curtidas_postagem FOREIGN KEY (postagem_id) REFERENCES postagens(id)
);

-- Tabela de Amizades
CREATE TABLE IF NOT EXISTS amizades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    amigo_id INT,
    status VARCHAR(20) DEFAULT 'pendente',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP(),
    CONSTRAINT fk_amizades_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_amizades_amigo FOREIGN KEY (amigo_id) REFERENCES usuarios(id),
    CONSTRAINT uc_usuarios_amigos UNIQUE (usuario_id, amigo_id)
);

-- Tabela de Mensagens Diretas
CREATE TABLE IF NOT EXISTS mensagens_diretas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    remetente_id INT,
    destinatario_id INT,
    conteudo TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP(),
    CONSTRAINT fk_mensagens_remetente FOREIGN KEY (remetente_id) REFERENCES usuarios(id),
    CONSTRAINT fk_mensagens_destinatario FOREIGN KEY (destinatario_id) REFERENCES usuarios(id)
);


-- ========================================================
-- 2. INSERTS DE USUÁRIOS (150 registros)
-- ========================================================

INSERT INTO usuarios (nome, email, senha, foto_perfil, bio, perms) VALUES
('Ana Silva', 'ana.silva@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Devoradora de romances policiais e fã incondicional de Agatha Christie.', 'USER'),
('Carlos Oliveira', 'carlos.oliveira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Apaixonado por clássicos da literatura russa e ficção científica contemporânea.', 'ADMIN'),
('Mariana Santos', 'mariana.santos@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora voraz de fantasia épica. Tolkien e Brandon Sanderson são meus favoritos.', 'USER'),
('João Pedro Costa', 'joao.costa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler ensaios de filosofia, história e biografias marcantes.', 'USER'),
('Beatriz Lima', 'beatriz.lima@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Não vivo sem um bom romance de época e um café quente do lado.', 'USER'),
('Lucas Ferreira', 'lucas.ferreira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Entusiasta de distopias, cyberpunk e ficção científica hard.', 'ADMIN'),
('Juliana Rodrigues', 'juliana.rodrigues@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Sempre com um livro de desenvolvimento pessoal ou psicologia na bolsa.', 'USER'),
('Gabriel Almeida', 'gabriel.almeida@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo graphic novels, mangás e ficção fantástica.', 'USER'),
('Larissa Martins', 'larissa.martins@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Afinidade por literatura nacional, poeticas urbanas e crônicas.', 'USER'),
('Rafael Souza', 'rafael.souza@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Colecionador de edições raras e fã de literatura gótica.', 'ADMIN'),
('Camila Ribeiro', 'camila.ribeiro@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora eclética: de literatura contemporânea a thrillers psicológicos.', 'USER'),
('Matheus Carvalho', 'matheus.carvalho@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fascinado por livros de divulgação científica e astronomia.', 'USER'),
('Amanda Cardoso', 'amanda.cardoso@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo romances com realismo mágico e literatura latino-americana.', 'USER'),
('Bruno Barbosa', 'bruno.barbosa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor compulsivo de Stephen King e Stephen Hawking.', 'USER'),
('Jessica Araujo', 'jessica.araujo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Adoro livros de true crime e investigação criminal.', 'ADMIN'),
('Felipe Rocha', 'felipe.rocha@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Interessado em biografias de grandes líderes e inovadores.', 'USER'),
('Leticia Dias', 'leticia.dias@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Apaixonada por livros ilustrados, arte e contos de fadas originais.', 'USER'),
('Diego Mendes', 'diego.mendes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo literatura de aventura, navegação e explorações históricas.', 'USER'),
('Vitoria Castro', 'vitoria.castro@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de livros de ficção jovem adulta e universos distópicos.', 'USER'),
('Vinicius Teixeira', 'vinicius.teixeira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor assíduo de literatura sobre economia, negócios e tecnologia.', 'USER'),
('Gabriela Moretti', 'gabriela.moretti@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Aprecio clássicos da literatura francesa e poesia modernista.', 'USER'),
('Rodrigo Nunes', 'rodrigo.nunes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler manuais técnicos de dia e livros de horror à noite.', 'USER'),
('Fernanda Correia', 'fernanda.correia@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Organizo clubes de leitura e adoro discutir obras de ficção histórica.', 'USER'),
('Eduardo Pinto', 'eduardo.pinto@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã do universo de George R. R. Martin e literatura medieval.', 'USER'),
('Patrizia Ramos', 'patrizia.ramos@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Coleciono livros sobre design, arquitetura e história da arte.', 'USER'),
('Leonardo Farias', 'leonardo.farias@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Adoro um bom mistério estilo Sherlock Holmes nas horas vagas.', 'USER'),
('Tatiane Medeiros', 'tatiane.medeiros@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Devoro livros sobre marketing, comportamento humano e storytelling.', 'USER'),
('Thiago Rezende', 'thiago.rezende@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de ficção científica clássica: Asimov, Arthur C. Clarke e Philip K. Dick.', 'USER'),
('Renata Azevedo', 'renata.azevedo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo comparar livros com suas adaptações cinematográficas.', 'USER'),
('Gustavo Cavalcanti', 'gustavo.cavalcanti@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de ficção científica hard e livros de matemática aplicada.', 'USER'),
('Vanessa Duarte', 'vanessa.duarte@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler sobre neurociência, psicologia e romances dramáticos.', 'USER'),
('Marcelo Freitas', 'marcelo.freitas@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Minha biblioteca pessoal é meu lugar favorito no mundo.', 'ADMIN'),
('Carolina Neves', 'carolina.neves@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora assídua de obras sobre estratégia, geopolítica e história.', 'USER'),
('Alexandre Vieira', 'alexandre.vieira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo literatura de ficção sombria e universos sombrios de fantasia.', 'USER'),
('Bianca Siqueira', 'bianca.siqueira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo livros fofos de romantasia e romances contemporâneos.', 'USER'),
('Daniel Campos', 'daniel.campos@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Pesquisador de IA lendo obras sobre ética na tecnologia e futuro.', 'USER'),
('Nicole Pires', 'nicole.pires@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Coleciono edições especiais de livros com capas bonitas.', 'USER'),
('Renan Guimaraes', 'renan.guimaraes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo contos de ficção curta e antologias de terror.', 'USER'),
('Luana Bicalho', 'luana.bicalho@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Entusiasta de literatura feminista e poesia contemporânea.', 'USER'),
('Igor Benitez', 'igor.benitez@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler mistérios de suspense de tribunal e espionagem.', 'ADMIN'),
('Debora Machado', 'debora.machado@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Adoro livros de viagens, memórias e relatos de aventura.', 'USER'),
('Murilo Fonseca', 'murilo.fonseca@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor constante de romances sobre viagens no tempo.', 'USER'),
('Sabina Moraes', 'sabina.moraes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Sempre lendo dois ou três livros ao mesmo tempo.', 'USER'),
('Caio Queiroz', 'caio.queiroz@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Entusiasta da obra de H.P. Lovecraft e terror cósmico.', 'USER'),
('Heloisa Diniz', 'heloisa.diniz@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Interessada em livros sobre produtividade, hábitos e biografia humana.', 'USER'),
('Vagner Lacerda', 'vagner.lacerda@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo clássicos da literatura brasileira como Machado de Assis.', 'ADMIN'),
('Priscila Esteves', 'priscila.esteves@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de romances dramáticos e livros de desenvolvimento pessoal.', 'USER'),
('Anderson Paiva', 'anderson.paiva@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de ficção filosófica e distopias sociais.', 'USER'),
('Jessica Bentes', 'jessica.bentes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo resenhar livros nas redes sociais e descobrir novos autores.', 'USER'),
('Marcos Vinicius', 'marcos.vinicius@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Preferência por quadrinhos independentes e romances históricos.', 'USER'),
('Arthur Freire', 'arthur.freire@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor viciado em mangás de ação e literatura fantástica.', 'USER'),
('Helena Castro', 'helena.castro@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Adoro romances contemporâneos e crônicas diárias.', 'USER'),
('Matheus Henrique', 'matheus.henrique@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Organizo minha estante por cores e leio muita ficção científica.', 'ADMIN'),
('Sophia Martins', 'sophia.martins@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de thrillers psicológicos e reviravoltas chocantes.', 'USER'),
('Heitor Lima', 'heitor.lima@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de biografias de músicos e história do rock.', 'USER'),
('Alice Rocha', 'alice.rocha@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo a escrita poética de Clarice Lispector e Cecília Meireles.', 'USER'),
('Bernardo Souza', 'bernardo.souza@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de livros de desenvolvimento pessoal e finanças.', 'USER'),
('Laura Ramos', 'laura.ramos@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Devoradora de romances de época da Julia Quinn.', 'USER'),
('Lorenzo Dias', 'lorenzo.dias@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fascinado por mitologia grega e contos nórdicos.', 'USER'),
('Valentina Silva', 'valentina.silva@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo colecionar livros de poesia moderna.', 'USER'),
('Gabriel Santos', 'gabriel.santos@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Especialista em livros técnicos de programação e arquitetura de software.', 'ADMIN'),
('Manuela Oliveira', 'manuela.oliveira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora compulsiva de fantasia nacional e YA.', 'USER'),
('Nicolas Pereira', 'nicolas.pereira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de HQs da Marvel, DC e graphic novels autorais.', 'USER'),
('Luiza Carvalho', 'luiza.carvalho@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo livros de culinária e crônicas gastronômicas.', 'USER'),
('Pedro Lucas', 'pedro.lucas@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de suspense e histórias de sobrevivência na natureza.', 'USER'),
('Isadora Mendes', 'isadora.mendes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Apaixonada por romances epistolares e literatura clássica.', 'USER'),
('Davi Alcantara', 'davi.alcantara@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler ensaios sobre cinema e roteiros de filmes.', 'USER'),
('Julia Fernandes', 'julia.fernandes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Sempre com um livro de suspense psicológico na cabeceira.', 'USER'),
('Lucas Gabriel', 'lucas.gabriel@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de mangás seinen e ficção científica distópica.', 'USER'),
('Melissa Ribeiro', 'melissa.ribeiro@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de romances dramáticos que fazem chorar.', 'USER'),
('Enzo Gabriel', 'enzo.gabriel@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo livros de jogos, RPG e mundos de fantasia medieval.', 'USER'),
('Clara Barbosa', 'clara.barbosa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de literatura russa e clássicos universais.', 'USER'),
('Mateus Araujo', 'mateus.araujo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fascinado por livros de astronomia e exploração espacial.', 'USER'),
('Mariana Costa', 'mariana.costa2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo livros ilustrados e contos de fadas dark.', 'USER'),
('Gustavo Henrique', 'gustavo.henrique@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor voraz de literatura policial e clássicos de mistério.', 'ADMIN'),
('Giovana Lima', 'giovana.lima@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Apaixonada por romances contemporâneos leves e divertidos.', 'USER'),
('Murilo Souza', 'murilo.souza@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de livros sobre história do Brasil e política.', 'USER'),
('Beatriz Cardoso', 'beatriz.cardoso@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de fantasia urbana e criaturas mágicas.', 'USER'),
('Pietro Martins', 'pietro.martins@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de Stephen King e livros de terror psicológico.', 'USER'),
('Rafaela Rocha', 'rafaela.rocha@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo livros de arte, fotografia e design gráfico.', 'USER'),
('Samuel Dias', 'samuel.dias@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de ensaios filosóficos e existencialismo.', 'USER'),
('Nicole Alcantara', 'nicole.alcantara@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de romances históricos e dinastias antigas.', 'USER'),
('Benjamin Pereira', 'benjamin.pereira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo livros de ficção científica militar e geopolítica futurista.', 'USER'),
('Larissa Carvalho', 'larissa.carvalho2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de poesia contemporânea e livros de autoexpressão.', 'USER'),
('Theo Lucas', 'theo.lucas@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fascinado por livros de mitos, lendas e folclore mundial.', 'USER'),
('Ester Fernandes', 'ester.fernandes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Apaixonada por romances de época e bailes da realeza.', 'USER'),
('Vicente Mendes', 'vicente.mendes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de biografias de cientistas e inventores famosos.', 'USER'),
('Lorena Ribeiro', 'lorena.ribeiro@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo ler livros de desenvolvimento pessoal e mindfulness.', 'USER'),
('Noah Alcantara', 'noah.alcantara@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de HQs independentes e quadrinhos underground.', 'USER'),
('Rebeca Barbosa', 'rebeca.barbosa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de thrillers médicos e dramas hospitalares.', 'USER'),
('Anthony Araujo', 'anthony.araujo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler sobre economia comportamental e finanças.', 'USER'),
('Leticia Costa', 'leticia.costa2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Administro um clube de leitura dedicado a clássicos modernos.', 'ADMIN'),
('Isaac Lima', 'isaac.lima@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor voraz de fantasia sombria e grimdark.', 'USER'),
('Marina Souza', 'marina.souza2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo romances dramáticos e livros de poesia urbana.', 'USER'),
('Eduardo Martins', 'eduardo.martins@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de ficção científica dura e romances espaciais.', 'USER'),
('Sarah Rocha', 'sarah.rocha@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de biografias de mulheres marcantes na história.', 'USER'),
('Francisco Dias', 'francisco.dias@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de livros de história militar e guerras mundiais.', 'USER'),
('Vitoria Pereira', 'vitoria.pereira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Apaixonada por literatura fantástica e universos mágicos.', 'USER'),
('Joao Miguel', 'joao.miguel@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de mangás de mistério e investigação.', 'USER'),
('Alana Carvalho', 'alana.carvalho@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo romances fofos e comédia romântica literária.', 'USER'),
('Caio Fernandes', 'caio.fernandes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de livros de suspense corporativo e conspirações.', 'USER'),
('Catarina Mendes', 'catarina.mendes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de contos clássicos e literatura gótica.', 'USER'),
('Bryan Ribeiro', 'bryan.ribeiro@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler sobre inteligência artificial e o futuro da tecnologia.', 'USER'),
('Olivia Alcantara', 'olivia.alcantara@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo livros de poesia romântica e haicais.', 'USER'),
('Emanuel Barbosa', 'emanuel.barbosa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de livros de terror cósmico e suspense sobrenatural.', 'USER'),
('Eloa Araujo', 'eloa.araujo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de romances young adult e histórias de amadurecimento.', 'USER'),
('Bento Costa', 'bento.costa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fascinado por livros de arqueologia e civilizações antigas.', 'USER'),
('Liz Lima', 'liz.lima@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de biografias de artistas e pintores renomados.', 'USER'),
('Joaquim Souza', 'joaquim.souza@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amante de edições colecionáveis de literatura clássica.', 'ADMIN'),
('Agatha Martins', 'agatha.martins@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo romances policiais e tramas cheias de enigmas.', 'USER'),
('Gael Rocha', 'gael.rocha@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de ficção científica distópica e universos cyberpunk.', 'USER'),
('Celine Dias', 'celine.dias@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de literatura feminista e ensaios sociológicos.', 'USER'),
('Dante Pereira', 'dante.pereira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler sobre filosofia antiga e estoicismo.', 'USER'),
('Mel Carvalho', 'mel.carvalho@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de romances contemporâneos e dramas familiares.', 'USER'),
('Ravi Fernandes', 'ravi.fernandes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fascinado por livros de oceanografia e mistérios do mar.', 'USER'),
('Maya Mendes', 'maya.mendes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo ler livros de fantasia urbana e mistérios mágicos.', 'USER'),
('Gael Ribeiro', 'gael.ribeiro@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de livros de história geral e revoluções.', 'USER'),
('Isis Alcantara', 'isis.alcantara@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de romances dramáticos e cartas de amor históricas.', 'USER'),
('Dom Barbosa', 'dom.barbosa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler thrillers de ação e espionagem internacional.', 'USER'),
('Antonela Araujo', 'antonela.araujo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de contos de fadas recontados e literatura fantástica.', 'USER'),
('Otto Costa', 'otto.costa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de livros de engenharia, invenções e mecânica.', 'USER'),
('Stella Lima', 'stella.lima@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo poesias simbolistas e literatura modernista brasileira.', 'USER'),
('Martin Souza', 'martin.souza@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de biografias de grandes líderes políticos.', 'USER'),
('Aurora Martins', 'aurora.martins@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Apaixonada por livros ilustrados e literatura infantil mágica.', 'USER'),
('Levi Rocha', 'levi.rocha@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler ficção científica sobre viagens no tempo.', 'USER'),
('Maitê Dias', 'maite.dias@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de romances voltados para o público jovem.', 'USER'),
('Raul Pereira', 'raul.pereira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Especialista em resenhas de livros de fantasia e ficção.', 'ADMIN'),
('Celine Carvalho', 'celine.carvalho@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo literatura latino-americana e realismo mágico.', 'USER'),
('Kenzo Fernandes', 'kenzo.fernandes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de mangás de suspense, terror e drama psicológico.', 'USER'),
('Diana Mendes', 'diana.mendes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de mitologias antigas e religiões comparadas.', 'USER'),
('Noah Ribeiro', 'noah.ribeiro@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler sobre biologia evolutiva e ecologia.', 'USER'),
('Luna Alcantara', 'luna.alcantara@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Apaixonada por romances de época e bailes vitorianos.', 'USER'),
('Gael Barbosa', 'gael.barbosa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de livros sobre finanças pessoais e investimentos.', 'USER'),
('Chloe Araujo', 'chloe.araujo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo livros de autoajuda criativa e escrita terapêutica.', 'USER'),
('Dante Costa', 'dante.costa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de literatura clássica russa e alemã.', 'USER'),
('Jade Lima', 'jade.lima@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora voraz de romances contemporâneos e comédias.', 'USER'),
('Gael Souza', 'gael.souza2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler sobre a história da arte e grandes museus.', 'USER'),
('Maya Martins', 'maya.martins2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de poesia contemporânea e versos livres.', 'USER'),
('Noah Rocha', 'noah.rocha2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de HQs de super-heróis e graphic novels independentes.', 'USER'),
('Lara Dias', 'lara.dias@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo livros de receitas, panificação e memórias de chefs.', 'USER'),
('Gael Pereira', 'gael.pereira2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fascinado por livros de paleontologia e dinossauros.', 'USER'),
('Luna Carvalho', 'luna.carvalho2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de romances dramáticos e contos de suspense.', 'USER'),
('Dante Fernandes', 'dante.fernandes2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Gosto de ler ensaios sobre o futuro da humanidade e IA.', 'USER'),
('Maya Mendes', 'maya.mendes2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Apaixonada por sagas de fantasia épica e mapas detalhados.', 'USER'),
('Noah Ribeiro', 'noah.ribeiro2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitor de livros sobre exploração espacial e astronomia.', 'USER'),
('Lara Barbosa', 'lara.barbosa2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo romances com tramas de mistério e segredos familiares.', 'USER'),
('Gael Araujo', 'gael.araujo2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Fã de livros de terror psicológico e contos macabros.', 'USER'),
('Luna Costa', 'luna.costa2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Leitora de poesia romântica e cartas literárias.', 'USER'),
('Dante Lima', 'dante.lima2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Administro fóruns de discussão sobre literatura clássica e moderna.', 'ADMIN'),
('Maya Souza', 'maya.souza2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 'Amo romances leves e coleciono marcadores de página artesanais.', 'USER');


-- ========================================================
-- 3. INSERTS DE LIVROS (150 registros)
-- ========================================================

INSERT INTO livros (titulo, autor, isbn, descricao, genero, ano_publicacao, capa) VALUES
('Dom Casmurro', 'Machado de Assis', '978-85-359-1484-9', 'A clássica e intrigante dúvida sobre a fidelidade de Capitu vista pelos olhos de Bentinho.', 'Romance', 1899, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'),
('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', '978-85-209-2325-2', 'Uma fábula poética e filosófica sobre amizade, amor e o sentido da vida.', 'Fábula', 1943, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73'),
('1984', 'George Orwell', '978-04-515-2493-5', 'Uma obra-prima distópica que retrata um regime totalitário de vigilância extrema.', 'Ficção Científica', 1949, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('O Senhor dos Anéis: A Sociedade do Anel', 'J.R.R. Tolkien', '978-06-186-4015-7', 'O início da grandiosa jornada épica pela Terra-média para destruir o Um Anel.', 'Fantasia', 1954, 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb'),
('Orgulho e Preconceito', 'Jane Austen', '978-01-414-3951-8', 'Um retrato espirituoso das convenções sociais e do amor na Inglaterra do século XIX.', 'Romance', 1813, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('Crime e Castigo', 'Fiódor Dostoiévski', '978-01-404-4913-6', 'O dilema moral e psicológico de um ex-estudante após cometer um assassinato.', 'Romance Psicológico', 1866, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6'),
('O Hobbit', 'J.R.R. Tolkien', '978-05-479-2822-7', 'A aventura fantástica de Bilbo Bolseiro em busca de um tesouro guardado por um dragão.', 'Fantasia', 1937, 'https://images.unsplash.com/photo-1621351183012-e2f997af89cf'),
('A Revolução dos Bichos', 'George Orwell', '978-04-515-2634-2', 'Uma sátira feroz sobre o poder, a corrupção e os rumos de uma revolução política.', 'Sátira Política', 1945, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('O Cortiço', 'Aluísio Azevedo', '978-85-081-3449-6', 'Retrato cru e coletivo da vida em uma estalagem carioca sob a ótica naturalista.', 'Naturalismo', 1890, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Memórias Póstumas de Brás Cubas', 'Machado de Assis', '978-85-254-2234-7', 'Narrado por um defunto autor, o livro ironiza a sociedade burguesa do século XIX.', 'Realismo', 1881, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090'),
('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', '978-07-475-3269-9', 'O começo da saga mágica do menino bruxo que descobre seu destino em Hogwarts.', 'Fantasia', 1997, 'https://images.unsplash.com/photo-1618609377864-68609b857e90'),
('O Alquimista', 'Paulo Coelho', '978-00-611-2241-5', 'Uma inspiradora jornada de autoconhecimento e busca pelos sonhos.', 'Aventura', 1988, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('Capitães da Areia', 'Jorge Amado', '978-85-359-0229-7', 'A rotina de meninos de rua em Salvador e suas lutas pela sobrevivência.', 'Modernismo', 1937, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66'),
('Vidas Secas', 'Graciliano Ramos', '978-85-010-1431-2', 'O drama comovente de uma família de retirantes nordestinos fugindo da seca.', 'Romance Regionalista', 1938, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'),
('Grande Sertão: Veredas', 'João Guimarães Rosa', '978-85-209-2326-9', 'Um mergulho profundo nas veredas mineiras através das memórias do jagunço Riobaldo.', 'Romance', 1956, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('Quarto de Despejo', 'Carolina Maria de Jesus', '978-85-286-1393-3', 'O relato visceral e cotidiano de uma catadora de papel na favela do Canindé.', 'Autobiografia', 1960, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('O Guarani', 'José de Alencar', '978-85-081-4321-4', 'Amor proibido e heroísmo entre o índio Peri e a jovem nobre Cecília.', 'Romantismo', 1857, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da'),
('Senhora', 'José de Alencar', '978-85-209-1988-0', 'Uma dura crítica às convenções matrimoniais e ao casamento por interesse financeiro.', 'Romantismo', 1875, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61'),
('A Moreninha', 'Joaquim Manuel de Macedo', '978-85-080-1234-5', 'Um romance leve e idealizado ambientado em uma ilha na costa do Rio de Janeiro.', 'Romantismo', 1844, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('Triste Fim de Policarpo Quaresma', 'Lima Barreto', '978-85-723-2891-2', 'A saga idealista e trágica de um patriota apaixonado pelo Brasil.', 'Pré-Modernismo', 1915, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Iracema', 'José de Alencar', '978-85-081-1233-1', 'A lenda da virgem dos lábios de mel e a fundação mítica do Ceará.', 'Romantismo', 1865, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090'),
('O Alienista', 'Machado de Assis', '978-85-359-0524-3', 'A sátira genial sobre a loucura e a ciência na vila de Itaguaí.', 'Satírica', 1882, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'),
('Dom Quixote', 'Miguel de Cervantes', '978-84-376-0494-7', 'As cômicas e trágicas aventuras do cavaleiro andante que confundia moinhos com gigantes.', 'Romance', 1605, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73'),
('A Metamorfose', 'Franz Kafka', '978-85-359-0955-5', 'Gregor Samsa acorda transformado em um inseto monstruoso, gerando crise familiar.', 'Novela', 1915, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('O Príncipe', 'Maquiavel', '978-85-723-2654-3', 'Tratado clássico sobre a conquista e a manutenção do poder político.', 'Filosofia Política', 1532, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('A Divina Comédia', 'Dante Alighieri', '978-85-209-2458-7', 'A jornada alegórica do autor pelo Inferno, Purgatório e Paraíso.', 'Poesia Épica', 1320, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6'),
('Hamlet', 'William Shakespeare', '978-01-410-3614-4', 'A célebre tragédia do príncipe dinamarquês assombrado pelo espectro do pai.', 'Tragédia', 1603, 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb'),
('Romeu e Julieta', 'William Shakespeare', '978-01-413-9630-9', 'O amor impossível entre jovens de famílias rivais em Verona.', 'Tragédia', 1597, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('Ulisses', 'James Joyce', '978-01-411-8280-3', 'Um dia na vida de Leopold Bloom pelas ruas de Dublin, marco do modernismo.', 'Modernismo', 1922, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66'),
('Em Busca do Tempo Perdido', 'Marcel Proust', '978-01-411-8031-1', 'Reflexão monumental sobre a memória, a arte e a sociedade francesa.', 'Romance', 1913, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'),
('O Sol é Para Todos', 'Harper Lee', '978-00-611-2008-4', 'O racismo e a injustiça no sul dos EUA vistos pelos olhos infantis de Scout.', 'Romance', 1960, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('Cem Anos de Solidão', 'Gabriel García Márquez', '978-03-074-7472-8', 'A saga mítica da família Buendía na aldeia fictícia de Macondo.', 'Realismo Mágico', 1967, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da'),
('O Apanhador no Campo de Centeio', 'J.D. Salinger', '978-03-167-6948-0', 'A rebeldia e a angústia adolescente de Holden Caulfield em Nova York.', 'Romance', 1951, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61'),
('Moby-Dick', 'Herman Melville', '978-01-424-3724-6', 'A obsessão mortal do capitão Ahab pela gigantesca baleia branca.', 'Aventura', 1851, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('A letra escarlate', 'Nathaniel Hawthorne', '978-01-424-3726-0', 'Uma história de culpa, pecado e redenção na puritana Nova Inglaterra.', 'Romance Histórico', 1850, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Frankenstein', 'Mary Shelley', '978-01-414-3947-1', 'As consequências trágicas da criação de vida artificial pelo jovem cientista Victor.', 'Terror Gotico', 1818, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'),
('Drácula', 'Bram Stoker', '978-01-414-3984-6', 'O clássico epistolar do vampiro transilvano que aterroriza a Inglaterra vitoriana.', 'Terror', 1897, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73'),
('O Médico e o Monstro', 'Robert Louis Stevenson', '978-01-414-3973-0', 'A dualidade da natureza humana revelada pela poção do Dr. Jekyll.', 'Terror', 1886, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('Guerra e Paz', 'Liev Tolstói', '978-01-404-4793-4', 'A grandiosa narrativa da sociedade russa durante as invasões napoleônicas.', 'Romance Histórico', 1869, 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb'),
('Anna Kariênina', 'Liev Tolstói', '978-01-430-3500-8', 'Uma trágica história de paixão proibida e moralidade na alta sociedade russa.', 'Romance', 1878, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('Os Irmãos Karamazov', 'Fiódor Dostoiévski', '978-03-745-2837-9', 'Dilemas sobre fé, moralidade e parricídio na Rússia czarista.', 'Romance Filosófico', 1880, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6'),
('O Processo', 'Franz Kafka', '978-08-052-0999-0', 'Josef K. é misteriosamente preso e processado por um tribunal inacessível.', 'Ficção Absurda', 1925, 'https://images.unsplash.com/photo-1621351183012-e2f997af89cf'),
('O Estrangeiro', 'Albert Camus', '978-06-797-2020-1', 'Meursault comete um crime sem aparente motivação, encarando o absurdo da existência.', 'Filosófico', 1942, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('A Peste', 'Albert Camus', '978-06-797-2021-8', 'Uma cidade argelina isolada por uma epidemia reflete a condição humana.', 'Ficção', 1947, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('O Retrato de Dorian Gray', 'Oscar Wilde', '978-01-414-3957-0', 'Um jovem permanece jovem enquanto seu retrato envelhece carregando seus pecados.', 'Ficção Filosófica', 1890, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090'),
('Neuromancer', 'William Gibson', '978-04-415-6959-5', 'O clássico fundacional do cyberpunk sobre hackers, inteligência artificial e vício.', 'Cyberpunk', 1984, 'https://images.unsplash.com/photo-1618609377864-68609b857e90'),
('Fahrenheit 451', 'Ray Bradbury', '978-14-516-7331-9', 'Em um futuro onde livros são proibidos, bombeiros têm a missão de queimá-los.', 'Ficção Científica', 1953, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('Admirável Mundo Novo', 'Aldous Huxley', '978-00-608-5052-4', 'Uma sociedade futurista controlada por condicionamento genético e prazer artificial.', 'Ficção Científica', 1932, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66'),
('Fundação', 'Isaac Asimov', '978-05-532-9335-7', 'Cientistas tentam preservar o conhecimento humano diante da queda de um império galáctico.', 'Ficção Científica', 1951, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'),
('Eu, Robô', 'Isaac Asimov', '978-05-532-9438-5', 'Contos clássicos que estruturam as famosas Leis da Robótica.', 'Ficção Científica', 1950, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('Duna', 'Frank Herbert', '978-04-411-7271-9', 'Intriga política e religiosa pelo controle do planeta deserto Arrakis e da especiaria.', 'Ficção Científica', 1965, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da'),
('Encontro com Rama', 'Arthur C. Clarke', '978-05-532-8745-5', 'A exploração de uma misteriosa estrutura cilíndrica alienígena que adentra o sistema solar.', 'Ficção Científica', 1973, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61'),
('2001: Uma Odisseia no Espaço', 'Arthur C. Clarke', '978-04-514-5799-8', 'Monólitos alienígenas e a rebeldia do supercomputador HAL 9000 em uma missão espacial.', 'Ficção Científica', 1968, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('O Guia do Mochileiro das Galáxias', 'Douglas Adams', '978-03-453-9180-3', 'As peripécias espaciais de Arthur Dent após a destruição da Terra.', 'Comédia Sci-Fi', 1979, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Ensaio sobre a Cegueira', 'José Saramago', '978-97-221-1028-1', 'Uma epidemia repentina de cegueira branca desorganiza a sociedade e revela instintos.', 'Ficção', 1995, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'),
('O Evangelho segundo Jesus Cristo', 'José Saramago', '978-97-221-0675-8', 'Uma releitura humanizada e polêmica da figura e trajetória de Jesus de Nazaré.', 'Romance Histórico', 1991, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73'),
('As Intermitências da Morte', 'José Saramago', '978-97-221-1773-0', 'O que acontece quando a Morte decide tirar férias e ninguém mais morre?', 'Ficção', 2005, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('A Ilha dos Tesouros', 'Robert Louis Stevenson', '978-01-413-2100-4', 'Jovens marinheiros, mapas misteriosos e piratas cruéis em busca de ouro enterrado.', 'Aventura', 1883, 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb'),
('As Viagens de Gulliver', 'Jonathan Swift', '978-01-414-3949-5', 'Sátira fantástica pelas terras de Lilliput, Brobdingnag e outras ilhas improváveis.', 'Sátira', 1726, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('Robinson Crusoe', 'Daniel Defoe', '978-01-414-3982-2', 'O marinheiro náufrago que passa décadas isolado em uma ilha deserta.', 'Aventura', 1719, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6'),
('Contos de Beedle, o Bardo', 'J.K. Rowling', '978-05-451-2828-5', 'Histórias mágicas muito conhecidas pelas crianças no universo de Harry Potter.', 'Fantasia', 2008, 'https://images.unsplash.com/photo-1621351183012-e2f997af89cf'),
('O Iluminado', 'Stephen King', '978-03-077-4365-7', 'Um escritor isolado em um hotel isolado cede à loucura e forças sobrenaturais.', 'Terror', 1977, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('It: A Coisa', 'Stephen King', '978-15-011-7546-6', 'Um grupo de amigos enfrenta uma entidade maligna ancestral que aterroriza sua cidade.', 'Terror', 1986, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Carrie', 'Stephen King', '978-03-077-4366-4', 'Garota oprimida na escola descobre ter poderes telecinéticos devastadores.', 'Terror', 1974, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090'),
('Misery', 'Stephen King', '978-06-797-2022-5', 'Escritor famoso é mantido refém por uma fã psicopata após um acidente de carro.', 'Suspense', 1987, 'https://images.unsplash.com/photo-1618609377864-68609b857e90'),
('O Colecionador', 'John Fowles', '978-03-162-9029-6', 'Colecionador de borboletas sequestra uma jovem aspirante a artista.', 'Suspense', 1963, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('O Silêncio dos Inocentes', 'Thomas Harris', '978-03-129-2458-4', 'Estagiária do FBI busca ajuda do brilhante psicopata Hannibal Lecter para capturar um serial killer.', 'Suspense', 1988, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66'),
('Psicose', 'Robert Bloch', '978-15-960-6435-5', 'O clássico motel isolado gerido por Norman Bates e sua mãe dominadora.', 'Terror', 1959, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'),
('O Código Da Vinci', 'Dan Brown', '978-03-074-7427-8', 'Um assassinato no Louvre revela segredos milenares acobertados pela Igreja.', 'Suspense', 2003, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('Anjos e Demônios', 'Dan Brown', '978-03-072-7767-1', 'Robert Langdon investiga uma conspiração secreta dos Illuminati contra o Vaticano.', 'Suspense', 2000, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da'),
('Inferno', 'Dan Brown', '978-03-855-3785-8', 'Mistérios inspirados na obra de Dante Alighieri para evitar uma catástrofe global.', 'Suspense', 2013, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61'),
('A Menina que Roubava Livros', 'Markus Zusak', '978-03-758-4220-7', 'Narrado pela própria Morte, acompanha uma garota na Alemanha nazista que encontra consolo nos livros.', 'Drama', 2005, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('O Caçador de Pipas', 'Khaled Hosseini', '978-15-944-8000-3', 'Amizade, culpa e redenção no Afeganistão antes e depois da ocupação soviética.', 'Drama', 2003, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('A Cidade do Sol', 'Khaled Hosseini', '978-15-944-8285-4', 'A trajetória de duas mulheres afegãs unidas pelo destino em meio a conflitos brutais.', 'Drama', 2007, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'),
('E o Vento Levou', 'Margaret Mitchell', '978-14-165-4889-8', 'A tumultuada vida de Scarlett O’Hara durante a Guerra Civil Americana.', 'Romance Histórico', 1936, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73'),
('Os Miseráveis', 'Victor Hugo', '978-01-404-4430-8', 'A odisseia de Jean Valjean em busca de redenção na França do século XIX.', 'Romance', 1862, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('O Corcunda de Notre-Dame', 'Victor Hugo', '978-01-404-4353-0', 'A paixão trágica do sineiro Quasimodo pela cigana Esmeralda em Paris.', 'Romance Gotico', 1831, 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb'),
('Os Lusíadas', 'Luís de Camões', '978-97-227-1455-8', 'Poema épico que celebra as grandes navegações e descobertas portuguesas.', 'Poesia Épica', 1572, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('Mensagem', 'Fernando Pessoa', '978-97-221-0326-9', 'Único livro de poemas em português publicado em vida pelo autor.', 'Poesia', 1934, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6'),
('Livro do Desassossego', 'Bernardo Soares', '978-97-220-4038-2', 'Reflexões fragmentadas, melancólicas e profundas sobre a existência.', 'Prosa', 1982, 'https://images.unsplash.com/photo-1621351183012-e2f997af89cf'),
('Amor de Perdição', 'Camilo Castelo Branco', '978-98-963-5002-3', 'Um clássico ultrarromântico de amores impossíveis e trágicos.', 'Romantismo', 1862, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('Os Maias', 'Eça de Queirós', '978-97-220-1014-8', 'Crítica mordaz à alta sociedade lisboeta através da decadência da família Maia.', 'Realismo', 1888, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('O Crime do Padre Amaro', 'Eça de Queirós', '978-97-220-1015-5', 'A hipocrisia clerical e os costumes provincianos em Portugal expostos sem filtros.', 'Realismo', 1875, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090'),
('A Relíquia', 'Eça de Queirós', '978-97-220-1016-2', 'Sátira hilária ao fanatismo religioso e à burguesia hipócrita.', 'Realismo', 1887, 'https://images.unsplash.com/photo-1618609377864-68609b857e90'),
('Pai Goriot', 'Honoré de Balzac', '978-01-404-4320-2', 'A obsessão paterna e a ambição na sociedade parisiense.', 'Realismo', 1835, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('Madame Bovary', 'Gustave Flaubert', '978-01-404-4912-9', 'O tédio conjugal e os delírios românticos de Emma Bovary na província francesa.', 'Realismo', 1857, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66'),
('A Dama das Camélias', 'Alexandre Dumas Filho', '978-01-404-3743-0', 'O romance trágico entre uma cortesã parisiense e um jovem burguês.', 'Romance', 1848, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'),
('O Conde de Monte Cristo', 'Alexandre Dumas', '978-01-404-4926-6', 'A elaborada vingança de Edmond Dantes após anos de injusto aprisionamento.', 'Aventura', 1844, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('Os Três Mosqueteiros', 'Alexandre Dumas', '978-01-404-4026-3', 'Amizade, espionagem e duelos na corte de Luís XIII.', 'Aventura', 1844, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da'),
('Guerra dos Mundos', 'H.G. Wells', '978-01-414-3981-5', 'A devastadora invasão da Terra por marcianos impiedosos.', 'Ficção Científica', 1898, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61'),
('A Máquina do Tempo', 'H.G. Wells', '978-05-532-8415-7', 'Um cientista viaja milhares de anos no futuro e descobre a bifurcação da humanidade.', 'Ficção Científica', 1895, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('O Homem Invisível', 'H.G. Wells', '978-01-414-3995-2', 'Um cientista perde a visibilidade física e a sanidade mental.', 'Ficção Científica', 1897, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Caninos Brancos', 'Jack London', '978-01-413-2101-1', 'A jornada de sobrevivência de um cão-lobo selvagem nas gélidas terras do Yukon.', 'Aventura', 1906, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'),
('O Chamado da Selva', 'Jack London', '978-01-403-9065-1', 'Um cachorro domesticado é levado para o Alasca e redescobre seus instintos primitivos.', 'Aventura', 1903, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73'),
('Peter Pan', 'J.M. Barrie', '978-01-413-2928-4', 'O garoto que se recusava a crescer e suas aventuras na Terra do Nunca.', 'Fantasia', 1911, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('Alice no País das Maravilhas', 'Lewis Carroll', '978-01-414-3976-1', 'As surreais e lógicas peripécias de Alice após cair na toca do coelho.', 'Fantasia', 1865, 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb'),
('As Aventuras de Tom Sawyer', 'Mark Twain', '978-01-430-3956-3', 'Travessuras infantis às margens do rio Mississippi.', 'Aventura', 1876, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('As Aventuras de Huckleberry Finn', 'Mark Twain', '978-01-424-3786-4', 'Fuga de barco pelo rio Mississippi ao lado de um escravo fugitivo.', 'Aventura', 1884, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6'),
('O Príncipe e o Mendigo', 'Mark Twain', '978-04-862-8653-3', 'Dois garotos idênticos de classes sociais opostas trocam de papéis.', 'Histórico', 1881, 'https://images.unsplash.com/photo-1621351183012-e2f997af89cf'),
('Kim', 'Rudyard Kipling', '978-01-414-3988-4', 'Espionagem e aventuras no subcontinente indiano durante o Grande Jogo.', 'Romance', 1901, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('O Livro da Selva', 'Rudyard Kipling', '978-01-404-3796-6', 'Mogli, o menino criado por lobos na selva indiana.', 'Aventura', 1894, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('The Great Gatsby', 'F. Scott Fitzgerald', '978-07-432-7356-5', 'A ilusão do sonho americano e as festas extravagantes do enigmático Jay Gatsby.', 'Romance', 1925, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090'),
('Crepúsculo', 'Stephenie Meyer', '978-03-160-1584-2', 'O romance adolescente entre uma jovem humana e um vampiro centenário.', 'Fantasia', 2005, 'https://images.unsplash.com/photo-1618609377864-68609b857e90'),
('Lua Nova', 'Stephenie Meyer', '978-03-161-6029-2', 'O sofrimento de Bella após a partida dos Cullen e sua aproximação de Jacob.', 'Fantasia', 2006, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('Eclipse', 'Stephenie Meyer', '978-03-161-6020-9', 'Escolhas difíceis e ameaças de um exército de recém-criados vampiros.', 'Fantasia', 2007, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66'),
('Amanhecer', 'Stephenie Meyer', '978-03-160-6792-8', 'Casamento, maternidade vampírica e o confronto final contra os Volturi.', 'Fantasia', 2008, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'),
('Jogos Vorazes', 'Suzanne Collins', '978-04-390-2348-1', 'Em uma realidade totalitária, jovens lutam até a morte em um reality show cruel.', 'Distopia', 2008, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('Em Chamas', 'Suzanne Collins', '978-04-390-2349-8', 'A faísca da rebelião se espalha pelos distritos após a vitória nos Jogos.', 'Distopia', 2009, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da'),
('A Esperança', 'Suzanne Collins', '978-04-390-2351-1', 'A guerra aberta contra a Capital liderada por Katniss Everdeen, o Tordo.', 'Distopia', 2010, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61'),
('A Culpa é das Estrelas', 'John Green', '978-05-252-4788-3', 'Dois jovens pacientes com câncer vivem um romance intenso e comovente.', 'Romance', 2012, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('Cidades de Papel', 'John Green', '978-01-424-1493-4', 'Jovem embarca em uma busca misteriosa após o sumiço repentino da vizinha.', 'Romance', 2008, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Percy Jackson e o Ladrão de Raios', 'Rick Riordan', '978-07-868-5629-9', 'Garoto descobre ser filho de Poseidon e é acusado de roubar o raio de Zeus.', 'Fantasia', 2005, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'),
('O Mar de Monstros', 'Rick Riordan', '978-07-868-5686-2', 'A busca pelo Velocino de Ouro para salvar o acampamento dos meio-sangues.', 'Fantasia', 2006, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73'),
('A Maldição do Titã', 'Rick Riordan', '978-14-231-0145-8', 'O resgate da deusa Ártemis e de uma caçadora desaparecida.', 'Fantasia', 2007, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('A Batalha do Labirinto', 'Rick Riordan', '978-14-231-0146-5', 'Invasão a um labirinto místico subterrâneo controlado pelo exército de Cronos.', 'Fantasia', 2008, 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb'),
('O Último Olimpiano', 'Rick Riordan', '978-14-231-0147-2', 'A grande batalha final pelo Monte Olimpo no coração de Nova York.', 'Fantasia', 2009, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('Aventuras de Sherlock Holmes', 'Arthur Conan Doyle', '978-01-410-2340-3', 'Casos clássicos solucionados pelo detetive mais famoso da Baker Street.', 'Mistério', 1892, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6'),
('Um Estudo em Vermelho', 'Arthur Conan Doyle', '978-15-052-7359-2', 'O primeiro encontro entre Sherlock Holmes e o Dr. Watson.', 'Mistério', 1887, 'https://images.unsplash.com/photo-1621351183012-e2f997af89cf'),
('O Cão dos Baskerville', 'Arthur Conan Doyle', '978-01-414-3958-7', 'Uma maldição ancestral e um cão demoníaco aterrorizam uma mansão nos pântanos.', 'Mistério', 1902, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('O Vale do Medo', 'Arthur Conan Doyle', '978-01-404-3932-8', 'Um assassinato misterioso conectado a sociedades secretas industriais.', 'Mistério', 1915, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('O Signo dos Quatro', 'Arthur Conan Doyle', '978-01-404-3907-6', 'Tesouros perdidos, vingança e um crime enigmático em Londres.', 'Mistério', 1890, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090'),
('E Não Sobrou Nenhum', 'Agatha Christie', '978-00-620-7348-8', 'Dez pessoas isoladas em uma ilha começam a ser assassinadas uma a uma.', 'Mistério', 1939, 'https://images.unsplash.com/photo-1618609377864-68609b857e90'),
('Assassinato no Expresso do Oriente', 'Agatha Christie', '978-00-626-9366-2', 'Hercule Poirot investiga um homicídio cometido dentro de um trem preso na neve.', 'Mistério', 1934, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('Morte no Nilo', 'Agatha Christie', '978-00-620-7360-0', 'Crime passional durante um cruzeiro luxuoso pelo rio Nilo.', 'Mistério', 1937, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66'),
('O Misterioso Caso de Styles', 'Agatha Christie', '978-00-620-7386-0', 'O primeiro caso solucionado pelo detetive belga Hercule Poirot.', 'Mistério', 1920, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'),
('Os Crimes ABC', 'Agatha Christie', '978-00-620-7358-7', 'Um serial killer desafia Poirot enviando cartas prévias sobre seus crimes.', 'Mistério', 1936, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('Enola Holmes: O Caso do Marquês Desaparecido', 'Nancy Springer', '978-01-424-1358-6', 'A irmã mais nova de Sherlock Holmes usa sua astúcia para resolver investigações.', 'Mistério', 2006, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da'),
('A Paciente Silenciosa', 'Alex Michaelides', '978-12-503-0169-6', 'Pintora famosa se recusa a falar após assassinar o marido, intrigando um terapeuta.', 'Thriller', 2019, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61'),
('Garota Exemplar', 'Gillian Flynn', '978-03-075-8837-1', 'O desaparecimento de uma esposa revela mentiras sombrias em um casamento.', 'Thriller', 2012, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('Objetos Cortantes', 'Gillian Flynn', '978-03-073-4155-6', 'Jornalista investiga assassinatos em sua cidade natal enquanto lida com traumas.', 'Thriller', 2006, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Lugares Escuros', 'Gillian Flynn', '978-03-073-4157-0', 'Única sobrevivente de um massacre familiar revisita o passado sombrio.', 'Thriller', 2009, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'),
('A Garota no Trem', 'Paula Hawkins', '978-15-944-8402-5', 'Mulher alcóolotra presencia algo suspeito pela janela do trem e se envolve em um sumiço.', 'Thriller', 2015, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73'),
('Antes de Dormir', 'S.J. Watson', '978-00-620-6056-3', 'Mulher perde a memória todos os dias ao acordar e tenta reconstruir sua vida.', 'Thriller', 2011, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('O Homem de Giz', 'C.J. Tudor', '978-11-019-8669-1', 'Desenhos de giz na infância retornam para assombrar um grupo de amigos adultos.', 'Terror', 2018, 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb'),
('Asilo Arkham', 'Grant Morrison', '978-09-302-8948-9', 'Batman enfrenta os criminosos mais insanos em uma graphic novel psicológica.', 'Quadrinhos', 1989, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('Watchmen', 'Alan Moore', '978-09-302-8923-6', 'Desconstrução sombria e realista do conceito de super-heróis durante a Guerra Fria.', 'Quadrinhos', 1987, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6'),
('V de Vingança', 'Alan Moore', '978-09-302-8952-6', 'Um vigilante mascarado luta contra um regime fascista na Inglaterra futurista.', 'Quadrinhos', 1988, 'https://images.unsplash.com/photo-1621351183012-e2f997af89cf'),
('Batman: O Cavaleiro das Trevas', 'Frank Miller', '978-15-638-9342-1', 'O retorno envelhecido e sombrio de Bruce Wayne à ativa em Gotham City.', 'Quadrinhos', 1986, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('Persépolis', 'Marjane Satrapi', '978-03-757-1483-2', 'Autobiografia em quadrinhos sobre a infância durante a Revolução Islâmica no Irã.', 'Quadrinhos', 2000, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Maus', 'Art Spiegelman', '978-06-794-0641-1', 'Relato dos horrores do Holocausto representado através de animais antropomórficos.', 'Quadrinhos', 1980, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090'),
('Sandman: Prelúdios e Noturnos', 'Neil Gaiman', '978-15-638-9011-6', 'Morpheus, o Senhor dos Sonhos, busca recuperar seus artefatos de poder.', 'Quadrinhos', 1989, 'https://images.unsplash.com/photo-1618609377864-68609b857e90'),
('Deuses Americanos', 'Neil Gaiman', '978-00-620-7385-3', 'Deuses antigos e modernos entram em conflito pelo controle da crença humana.', 'Fantasia', 2001, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('Coraline', 'Neil Gaiman', '978-03-809-7778-8', 'Garota descobre uma passagem secreta para uma versão bizarra e perigosa de sua casa.', 'Fantasia Sombria', 2002, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66'),
('Lugar Nenhum', 'Neil Gaiman', '978-00-605-5434-7', 'Um homem comum cai em um submundo mágico e perigoso escondido sob Londres.', 'Fantasia Urbana', 1996, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'),
('Stardust: O Mistério da Estrela', 'Neil Gaiman', '978-00-609-3434-7', 'Jovem cruza o muro mágico para capturar uma estrela cadente e presentear sua amada.', 'Fantasia', 1999, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('O Oceano no Fim do Caminho', 'Neil Gaiman', '978-00-074-9271-8', 'Memórias de infância, magia ancestral e entidades perigosas em uma fazenda inglesa.', 'Fantasia', 2013, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da'),
('Macunaíma', 'Mário de Andrade', '978-85-359-1065-0', 'A rapsódia cômica e fantástica sobre o herói sem nenhum caráter na cultura brasileira.', 'Modernismo', 1928, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61'),
('Pauliceia Desvairada', 'Mário de Andrade', '978-85-723-2789-2', 'Poemas vanguardistas que marcaram o início do modernismo no Brasil.', 'Poesia', 1922, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('Sagarana', 'João Guimarães Rosa', '978-85-209-2327-6', 'Contos marcantes ambientados no sertão mineiro, misturando mitos e violência.', 'Contos', 1946, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Primeiras Estórias', 'João Guimarães Rosa', '978-85-209-2328-3', 'Pequenas narrativas poéticas sobre a alma humana e o universo sertanejo.', 'Contos', 1962, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'),
('Laços de Família', 'Clarice Lispector', '978-85-325-1153-9', 'Contos intimistas que revelam fissuras sutis no cotidiano familiar burguês.', 'Contos', 1960, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73'),
('A Hora da Estrela', 'Clarice Lispector', '978-85-325-1158-4', 'A trajetória miserável e poética da nordestina Macabéa no Rio de Janeiro.', 'Novela', 1977, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('A Paixão Segundo G.H.', 'Clarice Lispector', '978-85-325-1156-5', 'Monólogo existencial após uma experiência perturbadora com uma barata.', 'Romance', 1964, 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb'),
('Perto do Coração Selvagem', 'Clarice Lispector', '978-85-325-1151-5', 'O romance de estreia que revolucionou a introspecção psicológica na literatura.', 'Romance', 1943, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('Felicidade Clandestina', 'Clarice Lispector', '978-85-325-1160-7', 'Crônicas e contos sobre pequenas epifanias da infância e juventude.', 'Contos', 1971, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6'),
('A Cidade e as Serras', 'Eça de Queirós', '978-97-220-1017-9', 'Crítica bem-humorada ao progresso tecnológico e elogio à vida simples no campo.', 'Realismo', 1901, 'https://images.unsplash.com/photo-1621351183012-e2f997af89cf'),
('O Primo Basílio', 'Eça de Queirós', '978-97-220-1018-6', 'Adultério, intrigas e falsa moralidade na burguesia portuguesa.', 'Realismo', 1878, 'https://images.unsplash.com/photo-1532012197267-da84d127e765'),
('A Abadia de Northanger', 'Jane Austen', '978-01-414-3979-2', 'Sátira aos romances góticos populares através de uma jovem sonhadora.', 'Romance', 1818, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Razão e Sensibilidade', 'Jane Austen', '978-01-414-3966-7', 'O contraste entre duas irmãs ao lidarem com paixões e desilusões amorosas.', 'Romance', 1811, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090'),
('Mansfield Park', 'Jane Austen', '978-01-414-3980-8', 'A jornada moral de uma jovem humilde acolodida na mansidão de seus tios ricos.', 'Romance', 1814, 'https://images.unsplash.com/photo-1618609377864-68609b857e90'),
('Emma', 'Jane Austen', '978-01-414-3958-4', 'Os equívocos amorosos de uma jovem rica que adora bancar o cupido na vila.', 'Romance', 1815, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('Persuasão', 'Jane Austen', '978-01-414-3968-1', 'Segundas chances no amor após anos de separação e conselhos equivocados.', 'Romance', 1818, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66');


-- ========================================================
-- 4. INSERTS DE CLUBES (10 registros)
-- ========================================================

INSERT INTO clubes (nome, descricao, imagem, criador_id, data_criacao) VALUES
('Clube do Thriller & Mistério', 'Para leitores fascinados por crimes, reviravoltas e suspense psicológico.', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5', 2, '2026-01-15 10:00:00'),
('Leitores de Fantasia Épica', 'Espaço dedicado a grandes universos, guerras mágicas e sistemas de magia.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23', 3, '2026-01-18 14:30:00'),
('Ficção Científica e Futuro', 'Discutindo inteligência artificial, distopias, cyberpunk e exploração espacial.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', 6, '2026-01-20 09:15:00'),
('Clássicos da Literatura Mundial', 'Lendo e debatendo as maiores obras de todos os tempos.', 'https://images.unsplash.com/photo-1461360370896-922624d12aa1', 10, '2026-01-22 16:00:00'),
('Romances de Época & Contemporâneos', 'Para quem ama boas histórias de amor, dramas e encontros inesquecíveis.', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2', 5, '2026-02-01 11:20:00'),
('Clube da Literatura Brasileira', 'Valorizando os grandes autores nacionais, do Realismo ao Modernismo.', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f', 46, '2026-02-05 15:45:00'),
('Horror Cósmico e Sobrenatural', 'Amantes de Stephen King, Lovecraft e histórias de dar arrepios.', 'https://images.unsplash.com/photo-1509248961158-e54f6934749c', 15, '2026-02-10 20:00:00'),
('Biografias & História', 'Analisando a vida de figuras históricas e grandes acontecimentos reais.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a', 16, '2026-02-12 13:10:00'),
('HQ, Mangá e Graphic Novels', 'Debates sobre histórias em quadrinhos, mangás e arte sequencial.', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f', 8, '2026-02-15 18:25:00'),
('Desenvolvimento Pessoal & Hábitos', 'Livros sobre produtividade, psicologia humana e crescimento contínuo.', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643', 7, '2026-02-18 08:30:00');


-- ========================================================
-- 5. INSERTS DE POSTAGENS (10 registros)
-- ========================================================

INSERT INTO postagens (tipo, titulo, conteudo, avaliacao, usuario_id, clube_id, livro_id, data_criacao, data_atualizacao) VALUES
('REVIEW', 'Capitu traiu ou não? Minha análise sincera', 'Depois de reler Dom Casmurro com mais atenção, percebi como a narrativa de Bentinho é extremamente parcial...', 5.0, 1, 6, 1, '2026-02-20 10:00:00', NULL),
('REVIEW', 'O ritmo de 1984 é impressionante', 'Um dos livros mais angustiantes que já li. A construção do Grande Irmão é atemporal.', 4.5, 6, 3, 3, '2026-02-21 14:15:00', NULL),
('DISCUSSAO', 'Qual é a melhor ordem para ler O Senhor dos Anéis?', 'Pessoal do clube, vocês acham que vale a pena começar direto por A Sociedade do Anel ou passar antes por O Hobbit?', NULL, 3, 2, 4, '2026-02-22 11:30:00', NULL),
('REVIEW', 'Duna superou todas as minhas expectativas!', 'A profundidade política e ecológica de Arrakis é fantástica. Frank Herbert foi genial.', 5.0, 12, 3, 51, '2026-02-23 16:45:00', NULL),
('RECOMENDACAO', 'Para quem ama mistérios clássicos com reviravolta', 'Recomendo demais a leitura de E Não Sobrou Nenhum. Agatha Christie no seu ápice!', 5.0, 2, 1, 116, '2026-02-24 09:20:00', NULL),
('REVIEW', 'A Metamorfose e o sentimento de isolamento', 'O livro é curto, mas a carga reflexiva sobre a utilidade do indivíduo na sociedade é gigante.', 4.0, 4, 4, 24, '2026-02-25 18:00:00', NULL),
('DISCUSSAO', 'Opiniões sobre o final de O Iluminado', 'Acham que o livro é muito superior ao filme do Kubrick? Na minha opinião o desenvolvimento do Jack é melhor no papel.', 4.5, 15, 7, 62, '2026-02-26 21:10:00', NULL),
('RECOMENDACAO', 'Quadrinho obrigatório: Watchmen', 'Se você quer ver super-heróis em uma abordagem madura e realista, precisa ler Watchmen.', 5.0, 8, 9, 124, '2026-02-27 15:00:00', NULL),
('REVIEW', 'Reflexões sobre Hábitos e Produtividade', 'Leitura essencial para quem quer entender como pequenas mudanças geram grandes resultados ao longo do tempo.', 4.0, 7, 10, 45, '2026-02-28 08:30:00', NULL),
('RECOMENDACAO', 'Sensacional realismo mágico em Cem Anos de Solidão', 'Uma leitura envolvente e poética. A família Buendía marca a gente para sempre.', 5.0, 13, 5, 32, '2026-03-01 12:00:00', NULL);


-- ========================================================
-- 6. INSERTS DE RECOMENDAÇÃO DE LIVROS (10 registros)
-- ========================================================

INSERT INTO recomendacao_livros (postagem_id, usuario_id, livro_id, data_criacao) VALUES
(5, 2, 116, '2026-02-24 09:20:00'),
(8, 8, 124, '2026-02-27 15:00:00'),
(10, 13, 32, '2026-03-01 12:00:00'),
(1, 1, 1, '2026-03-01 14:00:00'),
(2, 6, 3, '2026-03-02 10:15:00'),
(4, 12, 51, '2026-03-02 11:30:00'),
(6, 4, 24, '2026-03-03 09:00:00'),
(7, 15, 62, '2026-03-03 16:20:00'),
(3, 3, 4, '2026-03-04 13:45:00'),
(9, 7, 45, '2026-03-04 17:10:00');


-- ========================================================
-- 7. INSERTS DE MEMBROS DE CLUBE (10 registros)
-- ========================================================

INSERT INTO membros_clube (usuario_id, clube_id, papel, data_entrada) VALUES
(2, 1, 'ADMIN', '2026-01-15 10:00:00'),
(15, 1, 'MEMBRO', '2026-01-16 11:30:00'),
(3, 2, 'ADMIN', '2026-01-18 14:30:00'),
(24, 2, 'MEMBRO', '2026-01-19 16:00:00'),
(6, 3, 'ADMIN', '2026-01-20 09:15:00'),
(12, 3, 'MODERADOR', '2026-01-21 10:00:00'),
(10, 4, 'ADMIN', '2026-01-22 16:00:00'),
(1, 4, 'MEMBRO', '2026-01-23 18:20:00'),
(5, 5, 'ADMIN', '2026-02-01 11:20:00'),
(46, 6, 'ADMIN', '2026-02-05 15:45:00');


-- ========================================================
-- 8. INSERTS DE COMENTÁRIOS (10 registros)
-- ========================================================

INSERT INTO comentarios (conteudo, usuario_id, postagem_id, data_criacao) VALUES
('Concordo plenamente com a sua análise! O narrador é totalmente não confiável.', 46, 1, '2026-02-20 10:45:00'),
('Verdade! O livro ganha um peso bem maior quando a gente relê com maturidade.', 11, 1, '2026-02-20 11:30:00'),
('Esse livro me deixou com paranoia por semanas, genial demais.', 28, 2, '2026-02-21 15:00:00'),
('Recomendo muito ler O Hobbit antes! Dá uma leveza excelente antes de entrar na parte densa da saga.', 12, 3, '2026-02-22 12:10:00'),
('O Hobbit com certeza! Deixa a experiência de A Sociedade do Anel muito mais rica.', 24, 3, '2026-02-22 13:00:00'),
('Duna é meu livro de ficção científica preferido da vida! Mal posso esperar para ler a continuação.', 30, 4, '2026-02-23 17:30:00'),
('Foi o primeiro livro de mistério que li na vida e continua sendo meu favorito até hoje!', 15, 5, '2026-02-24 10:00:00'),
('Kafka tem uma habilidade surreal de deixar a gente desconfortável com poucas páginas.', 2, 6, '2026-02-25 19:15:00'),
('Com certeza o livro desenvolve muito melhor o alcoolismo e a perda de sanidade do Jack.', 44, 7, '2026-02-26 22:00:00'),
('A estrutura e as cores dessa HQ são uma verdadeira obra de arte do Alan Moore.', 36, 8, '2026-02-27 16:40:00');


-- ========================================================
-- 9. INSERTS DE CURTIDAS (10 registros)
-- ========================================================

INSERT INTO curtidas (usuario_id, postagem_id, data_criacao) VALUES
(2, 1, '2026-02-20 10:15:00'),
(5, 1, '2026-02-20 11:00:00'),
(46, 1, '2026-02-20 12:30:00'),
(12, 2, '2026-02-21 14:30:00'),
(28, 2, '2026-02-21 15:20:00'),
(1, 3, '2026-02-22 12:00:00'),
(30, 4, '2026-02-23 17:00:00'),
(15, 5, '2026-02-24 09:40:00'),
(44, 7, '2026-02-26 21:30:00'),
(36, 8, '2026-02-27 15:30:00');


-- ========================================================
-- 10. INSERTS DE AMIZADES (10 registros)
-- ========================================================

INSERT INTO amizades (usuario_id, amigo_id, status, data_criacao) VALUES
(1, 2, 'aceito', '2026-01-15 08:00:00'),
(1, 3, 'aceito', '2026-01-16 09:30:00'),
(2, 6, 'aceito', '2026-01-18 11:10:00'),
(3, 4, 'aceito', '2026-01-20 14:00:00'),
(5, 7, 'aceito', '2026-01-22 16:45:00'),
(8, 12, 'pendente', '2026-02-10 10:00:00'),
(10, 15, 'aceito', '2026-02-12 12:30:00'),
(15, 44, 'pendente', '2026-02-14 15:20:00'),
(24, 30, 'recusado', '2026-02-15 18:00:00'),
(46, 1, 'aceito', '2026-02-18 09:10:00');


-- ========================================================
-- 11. INSERTS DE MENSAGENS DIRETAS (10 registros)
-- ========================================================

INSERT INTO mensagens_diretas (remetente_id, destinatario_id, conteudo, lida, data_criacao) VALUES
(1, 2, 'Oi Carlos! Vi seu comentário no post de Dom Casmurro, o que achou do final?', TRUE, '2026-02-20 11:00:00'),
(2, 1, 'Oi Ana! Achei sensacional, inclusive estou relendo Agatha Christie agora.', TRUE, '2026-02-20 11:05:00'),
(3, 12, 'E aí Matheus, consegue dar uma olhada na indicação de livros no clube de fantasia?', TRUE, '2026-02-22 14:00:00'),
(12, 3, 'Com certeza, vou organizar o tópico da semana ainda hoje!', TRUE, '2026-02-22 14:15:00'),
(6, 28, 'Thiago, você já leu Neuromancer? Acho que você vai gostar bastante!', TRUE, '2026-02-23 09:30:00'),
(28, 6, 'Ainda não li, Lucas! Vou colocar na minha lista de desejos agora mesmo.', TRUE, '2026-02-23 10:00:00'),
(15, 44, 'Caio, você recomenda ler Lovecraft antes de encarar O Homem de Giz?', FALSE, '2026-02-26 21:40:00'),
(8, 36, 'Daniel, tem alguma recomendação de graphic novel sci-fi recente?', TRUE, '2026-02-27 16:00:00'),
(36, 8, 'Dá uma olhada em Saga ou Paper Girls, são incríveis!', TRUE, '2026-02-27 16:20:00'),
(46, 1, 'Ana, bem-vinda ao clube de literatura brasileira! Fique à vontade para postar suas resenhas.', FALSE, '2026-03-01 13:00:00');