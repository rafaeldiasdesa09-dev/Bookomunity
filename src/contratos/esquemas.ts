
export const schemas = {
    // -------------------- USUÁRIOS -------------------- //

    registrarUsuario: {
        type: "object",
        properties: {
            nome: { type: "string", minLength: 1, maxLength: 100 },
            email: { type: "string", minLength: 1, maxLength: 254 },
            senha: { type: "string", minLength: 6, maxLength: 72 }
        },
        required: ["nome", "email", "senha"],
        additionalProperties: false
    },

    loginUsuario: {
        type: "object",
        properties: {
            email: { type: "string", minLength: 1, maxLength: 254 },
            senha: { type: "string", minLength: 1, maxLength: 72 }
        },
        required: ["email", "senha"],
        additionalProperties: false
    },

    atualizarPermissao: {
        type: "object",
        properties: {
            perms: {
                type: "string",
                enum: ["USER", "ADMIN"]
            }
        },
        required: ["perms"],
        additionalProperties: false
    },

    // -------------------- LIVROS -------------------- //

    criarLivro: {
        type: "object",
        properties: {
            titulo: { type: "string", minLength: 1 },
            autor: { type: "string", minLength: 1 },
            isbn: { type: "string" },
            descricao: { type: "string" },
            genero: { type: "string" },
            ano_publicacao: { type: ["integer", "null"] },
            capa: { type: ["string", "null"] }
        },
        required: ["titulo", "autor"],
        additionalProperties: false
    },

    atualizarLivro: {
        type: "object",
        properties: {
            titulo: { type: "string", minLength: 1 },
            autor: { type: "string", minLength: 1 },
            isbn: { type: "string" },
            descricao: { type: "string" },
            genero: { type: "string" },
            ano_publicacao: { type: ["integer", "null"] },
            capa: { type: ["string", "null"] }
        },
        required: ["titulo", "autor"],
        additionalProperties: false
    },

    // -------------------- CLUBES -------------------- //

    criarClube: {
        type: "object",
        properties: {
            nome: { type: "string", minLength: 1 },
            descricao: { type: ["string", "null"] },
            imagem: { type: ["string", "null"] },
            criador_id: { type: "integer", minimum: 1 }
        },
        required: ["nome", "criador_id"],
        additionalProperties: false
    },

    atualizarClube: {
        type: "object",
        properties: {
            nome: { type: "string", minLength: 1 },
            descricao: { type: ["string", "null"] },
            imagem: { type: ["string", "null"] }
        },
        required: ["nome"],
        additionalProperties: false
    },

    // -------------------- MEMBROS DE CLUBES -------------------- //

    adicionarMembro: {
        type: "object",
        properties: {
            usuario_id: { type: "integer", minimum: 1 },
            papel: { type: "string", minLength: 1 }
        },
        required: ["usuario_id"],
        additionalProperties: false
    },

    atualizarPapelMembro: {
        type: "object",
        properties: {
            papel: { type: "string", minLength: 1 }
        },
        required: ["papel"],
        additionalProperties: false
    },

    // -------------------- POSTAGENS -------------------- //

    criarPostagem: {
        type: "object",
        properties: {
            tipo: { type: "string" },
            titulo: { type: "string" },
            conteudo: { type: "string" },
            avaliacao: { type: ["number", "null"] },
            usuario_id: { type: "integer", minimum: 1 },
            livro_id: { type: "integer", minimum: 1 }
        },
        required: [
            "tipo",
            "titulo",
            "conteudo",
            "usuario_id",
            "livro_id"
        ],
        additionalProperties: false
    },

    atualizarPostagem: {
        type: "object",
        properties: {
            titulo: { type: "string" },
            conteudo: { type: "string" },
            avaliacao: { type: ["number", "null"] }
        },
        additionalProperties: false
    },

    // -------------------- COMENTÁRIOS -------------------- //

    criarComentario: {
        type: "object",
        properties: {
            usuario_id: { type: "integer", minimum: 1 },
            conteudo: { type: "string", minLength: 1 }
        },
        required: ["usuario_id", "conteudo"],
        additionalProperties: false
    },

    atualizarComentario: {
        type: "object",
        properties: {
            conteudo: { type: "string", minLength: 1 }
        },
        required: ["conteudo"],
        additionalProperties: false
    },

    // -------------------- CURTIDAS -------------------- //

    curtirPostagem: {
        type: "object",
        properties: {
            usuario_id: { type: "integer", minimum: 1 }
        },
        required: ["usuario_id"],
        additionalProperties: false
    },

    // -------------------- RECOMENDAÇÕES -------------------- //

    criarRecomendacao: {
        type: "object",
        properties: {
            postagem_id: { type: "integer", minimum: 1 },
            usuario_id: { type: "integer", minimum: 1 },
            livro_id: { type: "integer", minimum: 1 }
        },
        required: [
            "postagem_id",
            "usuario_id",
            "livro_id"
        ],
        additionalProperties: false
    },

    atualizarRecomendacao: {
        type: "object",
        properties: {
            postagem_id: { type: "integer", minimum: 1 },
            usuario_id: { type: "integer", minimum: 1 },
            livro_id: { type: "integer", minimum: 1 }
        },
        required: [
            "postagem_id",
            "usuario_id",
            "livro_id"
        ],
        additionalProperties: false
    },

    // -------------------- AMIZADES -------------------- //

    enviarPedidoAmizade: {
        type: "object",
        properties: {
            usuario_id: { type: "integer", minimum: 1 },
            amigo_id: { type: "integer", minimum: 1 }
        },
        required: ["usuario_id", "amigo_id"],
        additionalProperties: false
    },

    // -------------------- MENSAGENS -------------------- //

    enviarMensagem: {
        type: "object",
        properties: {
            remetente_id: { type: "integer", minimum: 1 },
            destinatario_id: { type: "integer", minimum: 1 },
            conteudo: { type: "string", minLength: 1 }
        },
        required: [
            "remetente_id",
            "destinatario_id",
            "conteudo"
        ],
        additionalProperties: false
    }
} as const;
//agora vai confio