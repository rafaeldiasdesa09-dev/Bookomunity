const openapi = {
    openapi: "3.0.3",
    info: {
        title: "Bookomunity API",
        version: "1.0.0",
        description: "Contratos da API Bookomunity"
    },
    components: {
        schemas: {
            Usuario: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    nome: { type: "string" },
                    email: { type: "string", format: "email" },
                    foto: { type: "string", nullable: true },
                    perms: { type: "string" }
                }
            },

            Livro: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    titulo: { type: "string" },
                    autor: { type: "string" },
                    descricao: { type: "string" },
                    capa: { type: "string", nullable: true }
                }
            },

            Clube: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    nome: { type: "string" },
                    descricao: { type: "string" },
                    criador_id: { type: "integer" }
                }
            },

            Postagem: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    conteudo: { type: "string" },
                    usuario_id: { type: "integer" },
                    clube_id: { type: "integer", nullable: true },
                    livro_id: { type: "integer", nullable: true },
                    avaliacao: { type: "number", nullable: true }
                }
            },

            Erro: {
                type: "object",
                properties: {
                    erro: { type: "string" },
                    mensagem: { type: "string" }
                }
            }
        }
    }
} as const;

export default openapi;