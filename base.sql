CREATE DATABASE IF NOT EXISTS bookomunity_db;

USE bookomunity_db;

-- 1. Tabela de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(254) UNIQUE,
    senha VARCHAR(255),
    foto_perfil VARCHAR(255),
    bio TEXT,
    perms VARCHAR(20),
    data_criacao DATETIME
);

-- 2. Tabela de livros
CREATE TABLE IF NOT EXISTS livros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200),
    autor VARCHAR(150),
    isbn VARCHAR(17),
    descricao TEXT,
    genero VARCHAR(100),
    ano_publicacao YEAR,
    capa VARCHAR(255)
);

-- 3. Tabela de clubes
CREATE TABLE IF NOT EXISTS clubes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT,
    imagem VARCHAR(255),
    criador_id INT,
    data_criacao DATETIME,
    CONSTRAINT fk_clubes_criador FOREIGN KEY (criador_id) REFERENCES usuarios(id)
);

-- 4. Tabela de postagens (FKs = usuarios, clubes e livros)
CREATE TABLE IF NOT EXISTS postagens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(20),
    titulo VARCHAR(200),
    conteudo TEXT,
    avaliacao DECIMAL(2,1), -- de 0.5 até 5, é estrelas que nem na amazon e etc etc
    usuario_id INT,
    clube_id INT,
    livro_id INT,
    data_criacao DATETIME default CURRENT_TIMESTAMP(),
    data_atualizacao DATETIME,
    CONSTRAINT fk_postagens_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_postagens_clube FOREIGN KEY (clube_id) REFERENCES clubes(id),
    CONSTRAINT fk_postagens_livro FOREIGN KEY (livro_id) REFERENCES livros(id)
);

-- 5. Tabela para postagem do tipo Recomendação (FKs = postagens, usuarios e livros)
CREATE TABLE IF NOT EXISTS recomendacao_livros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    postagem_id INT,
    usuario_id INT,
    livro_id INT,
    data_criacao DATETIME default CURRENT_TIMESTAMP(),
    CONSTRAINT fk_recom_postagem FOREIGN KEY (postagem_id) REFERENCES postagens(id),
    CONSTRAINT fk_recom_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_recom_livro FOREIGN KEY (livro_id) REFERENCES livros(id)
);

-- 6. Tabela de MembrosClube (ligação entre usuários e o clube que eles pertnecem) (FKs = usuarios e clubes)
CREATE TABLE IF NOT EXISTS membros_clube (
    usuario_id INT,
    clube_id INT,
    papel VARCHAR(20),
    data_entrada DATETIME,
    PRIMARY KEY (usuario_id, clube_id),
    CONSTRAINT fk_membros_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_membros_clube FOREIGN KEY (clube_id) REFERENCES clubes(id)
);

-- 7. Tabela de comentarios (FKs = usuarios e postagens)
CREATE TABLE IF NOT EXISTS comentarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conteudo TEXT,
    usuario_id INT,
    postagem_id INT,
    data_criacao DATETIME,
    CONSTRAINT fk_comentarios_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_comentarios_postagem FOREIGN KEY (postagem_id) REFERENCES postagens(id)
);

-- 8. Tabela de curtidas (FKs = usuarios e postagens)
CREATE TABLE IF NOT EXISTS curtidas (
    usuario_id INT,
    postagem_id INT,
    data_criacao DATETIME,
    PRIMARY KEY (usuario_id, postagem_id),
    CONSTRAINT fk_curtidas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_curtidas_postagem FOREIGN KEY (postagem_id) REFERENCES postagens(id)
);

-- 9. Tabela de amizades
CREATE TABLE IF NOT EXISTS amizades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    amigo_id INT,
    status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'aceito', 'recusado'
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP(),
    CONSTRAINT fk_amizades_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_amizades_amigo FOREIGN KEY (amigo_id) REFERENCES usuarios(id),
    -- Garante que não haja pedidos duplicados entre os mesmos usuários
    CONSTRAINT uc_usuarios_amigos UNIQUE (usuario_id, amigo_id)
);

-- 10. Tabela de mensagens diretas
CREATE TABLE IF NOT EXISTS mensagens_diretas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    remetente_id INT,
    destinatario_id INT,
    conteudo TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE, -- para saber se a mensagem foi visualizada
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP(),
    CONSTRAINT fk_mensagens_remetente FOREIGN KEY (remetente_id) REFERENCES usuarios(id),
    CONSTRAINT fk_mensagens_destinatario FOREIGN KEY (destinatario_id) REFERENCES usuarios(id)
);