const idParam = {
  name: "id",
  in: "path",
  required: true,
  description: "Identificador numérico positivo do recurso.",
  schema: { type: "integer", minimum: 1, example: 1 },
};

const response = (description: string, schema: object) => ({
  description,
  content: { "application/json": { schema } },
});
const schemaRef = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const responseRef = (name: string) => ({ $ref: `#/components/responses/${name}` });
const body = (name: string, required = true) => ({
  required,
  content: { "application/json": { schema: schemaRef(name) } },
});
const list = (name: string) => ({ type: "array", items: schemaRef(name) });
const standardErrors = {
  "400": responseRef("DadosInvalidos"),
  "404": responseRef("NaoEncontrado"),
  "500": responseRef("ErroServidor"),
};
const sessionSecurity = [{ sessionCookie: [] }];

const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Bookomunity API",
    version: "1.0.0",
    description:
      "Documentação dos endpoints do Bookomunity. Os recursos REST ficam sob `/api`; autenticação e administração usam `/auth` e `/admin`.",
  },
  servers: [
    { url: "http://localhost:6767", description: "Servidor local definido em src/server.ts" },
  ],
  tags: [
    { name: "Usuários" },
    { name: "Autenticação" },
    { name: "Livros" },
    { name: "Clubes" },
    { name: "Postagens" },
    { name: "Amizades" },
    { name: "Mensagens" },
    { name: "Administração" },
  ],
  paths: {
    "/api/usuarios": {
      get: {
        tags: ["Usuários"],
        summary: "Listar usuários",
        description:
          "Retorna até 50 usuários com id maior que `page`. Atenção: o controller usa SELECT *, então a resposta inclui o hash da senha; não exponha esse campo em produção.",
        operationId: "listarUsuarios",
        parameters: [{ name: "page", in: "query", required: true, description: "ID a partir do qual continuar a listagem.", schema: { type: "integer", minimum: 0, example: 0 } }],
        responses: { "200": response("Lista de usuários.", list("Usuario")), "500": responseRef("ErroServidor") },
      },
    },
    "/api/usuarios/{id}": {
      get: {
        tags: ["Usuários"], summary: "Buscar usuário por ID", operationId: "buscarUsuarioPorId", parameters: [idParam],
        responses: { "200": response("Usuário encontrado.", schemaRef("UsuarioPublico")), ...standardErrors },
      },
    },
    "/api/usuarios/{id}/amigos": {
      get: {
        tags: ["Usuários", "Amizades"], summary: "Listar amigos aceitos", operationId: "listarAmigos", parameters: [idParam],
        responses: { "200": response("Amigos do usuário.", list("Amigo")), ...standardErrors },
      },
    },
    "/api/usuarios/{id}/amigos/pedidos": {
      get: {
        tags: ["Usuários", "Amizades"], summary: "Listar pedidos de amizade recebidos", operationId: "listarPedidosAmizadePendentes", parameters: [idParam],
        responses: { "200": response("Pedidos pendentes.", list("PedidoAmizade")), ...standardErrors },
      },
    },
    "/api/livros": {
      get: {
        tags: ["Livros"], summary: "Listar livros", operationId: "listarLivros",
        parameters: [{ name: "page", in: "query", required: true, description: "Lista livros com id maior que este valor; limite de 50.", schema: { type: "integer", minimum: 0, example: 0 } }],
        responses: { "200": response("Lista de livros.", list("Livro")), "500": responseRef("ErroServidor") },
      },
      post: {
        tags: ["Livros"], summary: "Cadastrar livro", operationId: "criarLivro", requestBody: body("NovoLivro"),
        responses: { "201": response("Livro cadastrado.", schemaRef("CriacaoLivro")), "400": responseRef("DadosInvalidos"), "500": responseRef("ErroServidor") },
      },
    },
    "/api/livros/{id}": {
      get: {
        tags: ["Livros"], summary: "Buscar livro por ID", operationId: "buscarLivroPorId", parameters: [idParam],
        responses: { "200": response("Livro encontrado.", schemaRef("Livro")), ...standardErrors },
      },
      put: {
        tags: ["Livros"], summary: "Atualizar livro", operationId: "atualizarLivro", parameters: [idParam], requestBody: body("NovoLivro"),
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
      delete: {
        tags: ["Livros"], summary: "Excluir livro", operationId: "deletarLivro", parameters: [idParam],
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
    },
    "/api/clubes": {
      get: {
        tags: ["Clubes"], summary: "Listar clubes", operationId: "listarClubes",
        responses: { "200": response("Lista de clubes.", list("Clube")), "500": responseRef("ErroServidor") },
      },
      post: {
        tags: ["Clubes"], summary: "Cadastrar clube", operationId: "criarClube", requestBody: body("NovoClube"),
        responses: { "201": response("Clube cadastrado.", schemaRef("CriacaoClube")), "400": responseRef("DadosInvalidos"), "500": responseRef("ErroServidor") },
      },
    },
    "/api/clubes/{id}": {
      get: {
        tags: ["Clubes"], summary: "Buscar clube por ID", operationId: "buscarClubePorId", parameters: [idParam],
        responses: { "200": response("Clube encontrado.", schemaRef("Clube")), ...standardErrors },
      },
      put: {
        tags: ["Clubes"], summary: "Atualizar clube", operationId: "atualizarClube", parameters: [idParam], requestBody: body("AtualizaClube"),
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
      delete: {
        tags: ["Clubes"], summary: "Excluir clube", operationId: "deletarClube", parameters: [idParam],
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
    },
    "/api/clubes/{id}/membros": {
      get: {
        tags: ["Clubes"], summary: "Listar membros do clube", operationId: "listarMembrosClube", parameters: [idParam],
        responses: { "200": response("Membros do clube.", list("MembroClube")), ...standardErrors },
      },
      post: {
        tags: ["Clubes"], summary: "Adicionar membro ao clube", operationId: "adicionarMembroClube", parameters: [idParam], requestBody: body("NovoMembroClube"),
        responses: { "201": responseRef("Mensagem"), "400": responseRef("DadosInvalidos"), "500": responseRef("ErroServidor") },
      },
    },
    "/api/clubes/{id}/membros/{usuarioId}": {
      put: {
        tags: ["Clubes"], summary: "Atualizar papel do membro", operationId: "atualizarPapelMembro",
        parameters: [idParam, { name: "usuarioId", in: "path", required: true, schema: { type: "integer", minimum: 1 } }], requestBody: body("PapelMembro"),
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
      delete: {
        tags: ["Clubes"], summary: "Remover membro do clube", operationId: "removerMembroClube",
        parameters: [idParam, { name: "usuarioId", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
    },
    "/api/postagens": {
      get: {
        tags: ["Postagens"], summary: "Listar postagens", operationId: "listarPostagens",
        responses: { "200": response("Postagens em ordem decrescente de criação.", list("Postagem")), "500": responseRef("ErroServidor") },
      },
      post: {
        tags: ["Postagens"], summary: "Criar postagem", operationId: "criarPostagem",
        description: "Esta rota aplica o middleware de autenticação de sessão (`isAuth`).",
        security: sessionSecurity, requestBody: body("NovaPostagem"),
        responses: { "200": response("Postagem criada.", { type: "object", additionalProperties: true }), "401": responseRef("NaoAutorizado"), "500": responseRef("ErroServidor") },
      },
    },
    "/api/postagens/{id}": {
      get: {
        tags: ["Postagens"], summary: "Buscar postagem por ID", operationId: "buscarPostagemPorId", parameters: [idParam],
        responses: { "200": response("Postagem encontrada.", schemaRef("Postagem")), ...standardErrors },
      },
      put: {
        tags: ["Postagens"], summary: "Atualizar postagem", operationId: "atualizarPostagem", parameters: [idParam], requestBody: body("AtualizaPostagem"),
        responses: { "200": response("Postagem atualizada.", schemaRef("Resultado")), "404": response("Postagem não encontrada.", schemaRef("Resultado")), "500": responseRef("ErroServidor") },
      },
      delete: {
        tags: ["Postagens"], summary: "Excluir postagem", operationId: "deletarPostagem", parameters: [idParam],
        responses: { "200": response("Postagem excluída.", schemaRef("Resultado")), "404": response("Postagem não encontrada.", schemaRef("Resultado")), "500": responseRef("ErroServidor") },
      },
    },
    "/api/postagens/{id}/comentarios": {
      get: {
        tags: ["Postagens"], summary: "Listar comentários de uma postagem", operationId: "listarComentariosPorPostagem", parameters: [idParam],
        responses: { "200": response("Comentários em ordem de criação.", list("Comentario")), ...standardErrors },
      },
      post: {
        tags: ["Postagens"], summary: "Criar comentário", operationId: "criarComentario", parameters: [idParam], requestBody: body("NovoComentario"),
        responses: { "201": response("Comentário criado.", schemaRef("ComentarioCriado")), "400": responseRef("DadosInvalidos"), "500": responseRef("ErroServidor") },
      },
    },
    "/api/comentarios/{comentarioId}": {
      put: {
        tags: ["Postagens"], summary: "Atualizar comentário", operationId: "atualizarComentario",
        parameters: [{ name: "comentarioId", in: "path", required: true, schema: { type: "integer", minimum: 1 } }], requestBody: body("ConteudoComentario"),
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
      delete: {
        tags: ["Postagens"], summary: "Excluir comentário", operationId: "deletarComentario",
        parameters: [{ name: "comentarioId", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
    },
    "/api/postagens/{id}/curtidas": {
      get: {
        tags: ["Postagens"], summary: "Contar curtidas", operationId: "contarLikesPorPostagem", parameters: [idParam],
        responses: { "200": response("Resultado do COUNT(*) (array retornado pelo driver MySQL).", { type: "array", items: { type: "object", properties: { total: { type: "integer", example: 12 } } } }), ...standardErrors },
      },
      post: {
        tags: ["Postagens"], summary: "Curtir postagem", operationId: "curtirPostagem", parameters: [idParam], requestBody: body("UsuarioId"),
        responses: { "201": responseRef("Mensagem"), "400": responseRef("DadosInvalidos"), "500": responseRef("ErroServidor") },
      },
    },
    "/api/postagens/{id}/curtidas/{usuarioId}": {
      delete: {
        tags: ["Postagens"], summary: "Remover curtida", operationId: "descurtirPostagem",
        parameters: [idParam, { name: "usuarioId", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
    },
    "/api/recomendacoes": {
      get: {
        tags: ["Postagens"], summary: "Listar recomendações de livros", operationId: "listarPedidos",
        responses: { "200": response("Recomendações registradas.", list("Recomendacao")), "500": responseRef("ErroServidor") },
      },
      post: {
        tags: ["Postagens"], summary: "Criar recomendação", operationId: "criarPedido", requestBody: body("NovaRecomendacao"),
        responses: { "201": response("Recomendação criada.", schemaRef("RecomendacaoCriada")), "400": responseRef("DadosInvalidos"), "500": responseRef("ErroServidor") },
      },
    },
    "/api/recomendacoes/{id}": {
      get: {
        tags: ["Postagens"], summary: "Buscar recomendação por ID", operationId: "buscarPedidoPorId", parameters: [idParam],
        responses: { "200": response("Recomendação encontrada.", schemaRef("Recomendacao")), ...standardErrors },
      },
      put: {
        tags: ["Postagens"], summary: "Atualizar recomendação", operationId: "atualizarPedido", parameters: [idParam], requestBody: body("NovaRecomendacao"),
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
      delete: {
        tags: ["Postagens"], summary: "Excluir recomendação", operationId: "deletarPedido", parameters: [idParam],
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
    },
    "/api/amizades": {
      post: {
        tags: ["Amizades"], summary: "Enviar pedido de amizade", operationId: "enviarPedidoAmizade", requestBody: body("NovoPedidoAmizade"),
        responses: { "201": response("Pedido enviado.", schemaRef("IdMensagem")), "400": responseRef("DadosInvalidos"), "500": responseRef("ErroServidor") },
      },
    },
    "/api/amizades/{id}": {
      put: {
        tags: ["Amizades"], summary: "Aceitar pedido de amizade", operationId: "aceitarPedidoAmizade", parameters: [idParam],
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
      delete: {
        tags: ["Amizades"], summary: "Remover amizade ou pedido", operationId: "removerAmizade", parameters: [idParam],
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
    },
    "/api/mensagens/{usuario1}/{usuario2}": {
      get: {
        tags: ["Mensagens"], summary: "Listar mensagens entre usuários", operationId: "listarMensagensEntreUsuarios",
        parameters: [
          { name: "usuario1", in: "path", required: true, schema: { type: "integer", minimum: 1 } },
          { name: "usuario2", in: "path", required: true, schema: { type: "integer", minimum: 1 } },
        ],
        responses: { "200": response("Histórico em ordem cronológica.", list("MensagemDireta")), "400": responseRef("DadosInvalidos"), "500": responseRef("ErroServidor") },
      },
    },
    "/api/mensagens": {
      post: {
        tags: ["Mensagens"], summary: "Enviar mensagem direta", operationId: "enviarMensagem", requestBody: body("NovaMensagemDireta"),
        responses: { "201": response("Mensagem enviada.", schemaRef("MensagemDiretaCriada")), "400": responseRef("DadosInvalidos"), "500": responseRef("ErroServidor") },
      },
    },
    "/api/mensagens/{id}/lida": {
      put: {
        tags: ["Mensagens"], summary: "Marcar mensagem como lida", operationId: "marcarMensagemComoLida", parameters: [idParam],
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
    },
    "/api/mensagens/{id}": {
      delete: {
        tags: ["Mensagens"], summary: "Excluir mensagem", operationId: "deletarMensagem", parameters: [idParam],
        responses: { "200": responseRef("Mensagem"), ...standardErrors },
      },
    },
    "/auth/registro": {
      post: {
        tags: ["Autenticação"], summary: "Registrar usuário", operationId: "registrarUsuario",
        description: "Recebe multipart/form-data. Após o registro, redireciona para a tela de login; a foto é opcional.",
        requestBody: {
          required: true,
          content: { "multipart/form-data": { schema: { type: "object", required: ["nome", "email", "senha"], properties: {
            nome: { type: "string", maxLength: 100 }, email: { type: "string", format: "email", maxLength: 254 },
            senha: { type: "string", format: "password", minLength: 6, maxLength: 72 }, foto: { type: "string", format: "binary" },
          } } } },
        },
        responses: { "302": { description: "Redireciona para login ou retorna ao formulário se os dados forem inválidos." }, "500": { description: "Falha ao registrar usuário." } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Autenticação"], summary: "Iniciar sessão", operationId: "loginUsuario",
        description: "Valida as credenciais, cria a sessão e redireciona para `/explore` ou `/admin`.",
        requestBody: { required: true, content: {
          "application/json": { schema: { type: "object", required: ["email", "senha"], properties: { email: { type: "string", format: "email" }, senha: { type: "string", format: "password" } } } },
          "application/x-www-form-urlencoded": { schema: { type: "object", required: ["email", "senha"], properties: { email: { type: "string", format: "email" }, senha: { type: "string", format: "password" } } } },
        } },
        responses: {
          "302": { description: "Autenticação concluída." },
          "400": response("E-mail e senha não informados.", schemaRef("ErroMensagem")),
          "401": response("Credenciais inválidas.", schemaRef("ErroMensagem")),
          "500": response("Falha ao realizar login.", schemaRef("ErroMensagem")),
        },
      },
    },
    "/auth/logoff": {
      post: {
        tags: ["Autenticação"], summary: "Encerrar sessão", operationId: "sairDoUsuario", security: sessionSecurity,
        responses: { "302": { description: "Sessão encerrada; redireciona para `/explore`." }, "500": { description: "Falha ao encerrar a sessão." } },
      },
    },
    "/admin/usuarios": {
      get: {
        tags: ["Administração"], summary: "Listar usuários no painel", operationId: "listarUsuariosAdmin", security: sessionSecurity,
        responses: { "200": response("Lista de usuários.", { type: "object", properties: { usuarios: list("UsuarioAdmin") } }), "401": responseRef("NaoAutorizado"), "500": responseRef("ErroServidor") },
      },
    },
    "/admin/infos": {
      get: {
        tags: ["Administração"], summary: "Consultar estatísticas", operationId: "obterEstatisticasPainel", security: sessionSecurity,
        responses: { "200": response("Totais do sistema.", { type: "object", additionalProperties: { type: "integer" }, example: { total_usuarios: 25, total_livros: 100, total_clubes: 4, total_postagens: 32 } }), "401": responseRef("NaoAutorizado"), "500": responseRef("ErroServidor") },
      },
    },
    "/admin/console": {
      get: {
        tags: ["Administração"], summary: "Consultar conteúdo do console", operationId: "obterConsole", security: sessionSecurity,
        responses: { "200": response("Entradas atuais do console.", { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: {} } } }), "401": responseRef("NaoAutorizado"), "500": responseRef("ErroServidor") },
      },
    },
    "/admin/usuarios/{id}/perms": {
      patch: {
        tags: ["Administração"], summary: "Atualizar permissão de usuário", operationId: "atualizarPermissaoUsuario", security: sessionSecurity,
        parameters: [idParam], requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["perms"], properties: { perms: { type: "string", enum: ["USER", "ADMIN"] } } } } } },
        responses: {
          "200": response("Permissão atualizada.", { type: "object", properties: { mensagem: { type: "string" }, id: { type: "integer" }, perms: { type: "string", enum: ["USER", "ADMIN"] } } }),
          "400": response("ID ou permissão inválida, ou tentativa de remover a própria permissão de administrador.", schemaRef("ErroMensagem")),
          "401": responseRef("NaoAutorizado"), "404": responseRef("NaoEncontrado"), "500": responseRef("ErroServidor"),
        },
      },
    },
  },
  components: {
    securitySchemes: {
      sessionCookie: { type: "apiKey", in: "cookie", name: "connect.sid", description: "Cookie de sessão emitido após autenticação." },
    },
    responses: {
      DadosInvalidos: response("Dados obrigatórios ausentes ou inválidos.", schemaRef("Erro")),
      NaoEncontrado: response("Recurso não encontrado.", schemaRef("Erro")),
      NaoAutorizado: response("Sessão ausente, inválida ou sem permissão.", schemaRef("ErroMensagem")),
      ErroServidor: response("Erro interno ao processar a solicitação.", schemaRef("Erro")),
      Mensagem: response("Resultado da operação.", schemaRef("Mensagem")),
    },
    schemas: {
      Erro: { type: "object", properties: { erro: { type: "string" }, mensagem: { type: "string" }, success: { type: "boolean" }, message: { type: "string" } }, additionalProperties: true },
      ErroMensagem: { type: "object", required: ["mensagem"], properties: { mensagem: { type: "string" } } },
      Mensagem: { type: "object", required: ["mensagem"], properties: { mensagem: { type: "string" } } },
      Resultado: { type: "object", required: ["success", "message"], properties: { success: { type: "boolean" }, message: { type: "string" } } },
      Usuario: { type: "object", description: "O GET /api/usuarios retorna SELECT * e inclui o hash da senha no comportamento atual.", properties: {
        id: { type: "integer" }, nome: { type: "string", nullable: true }, email: { type: "string", format: "email", nullable: true }, senha: { type: "string", description: "Hash atualmente retornado pelo endpoint de listagem." },
        foto_perfil: { type: "string", nullable: true }, bio: { type: "string", nullable: true }, perms: { type: "string", nullable: true }, data_criacao: { type: "string", format: "date-time", nullable: true },
      } },
      UsuarioPublico: { type: "object", properties: {
        id: { type: "integer" }, nome: { type: "string", nullable: true }, email: { type: "string", format: "email", nullable: true }, foto_perfil: { type: "string", nullable: true },
        bio: { type: "string", nullable: true }, perms: { type: "string", nullable: true }, data_criacao: { type: "string", format: "date-time", nullable: true },
      } },
      UsuarioAdmin: { type: "object", properties: { id: { type: "integer" }, nome: { type: "string", nullable: true }, email: { type: "string", format: "email", nullable: true }, perms: { type: "string", nullable: true }, data_criacao: { type: "string", format: "date-time", nullable: true } } },
      Livro: { type: "object", properties: {
        id: { type: "integer" }, titulo: { type: "string", nullable: true }, autor: { type: "string", nullable: true }, isbn: { type: "string", nullable: true }, descricao: { type: "string", nullable: true },
        genero: { type: "string", nullable: true }, ano_publicacao: { type: "integer", nullable: true }, capa: { type: "string", nullable: true },
      } },
      NovoLivro: { type: "object", required: ["titulo", "autor"], properties: {
        titulo: { type: "string", maxLength: 200 }, autor: { type: "string", maxLength: 150 }, isbn: { type: "string", maxLength: 17, nullable: true }, descricao: { type: "string", nullable: true },
        genero: { type: "string", maxLength: 100, nullable: true }, ano_publicacao: { type: "integer", nullable: true }, capa: { type: "string", nullable: true },
      } },
      CriacaoLivro: { type: "object", properties: { mensagem: { type: "string" }, id: { type: "integer" }, titulo: { type: "string" }, autor: { type: "string" } } },
      Clube: { type: "object", properties: {
        id: { type: "integer" }, nome: { type: "string", nullable: true }, descricao: { type: "string", nullable: true }, imagem: { type: "string", nullable: true },
        criador_id: { type: "integer", nullable: true }, data_criacao: { type: "string", format: "date-time", nullable: true }, nome_criador: { type: "string", nullable: true },
      } },
      NovoClube: { type: "object", required: ["nome", "criador_id"], properties: { nome: { type: "string", maxLength: 100 }, descricao: { type: "string", nullable: true }, imagem: { type: "string", nullable: true }, criador_id: { type: "integer", minimum: 1 } } },
      AtualizaClube: { type: "object", required: ["nome"], properties: { nome: { type: "string", maxLength: 100 }, descricao: { type: "string", nullable: true }, imagem: { type: "string", nullable: true } } },
      CriacaoClube: { type: "object", properties: { mensagem: { type: "string" }, id: { type: "integer" }, nome: { type: "string" }, criador_id: { type: "integer" }, data_criacao: { type: "string", format: "date-time" } } },
      MembroClube: { type: "object", properties: { usuario_id: { type: "integer" }, clube_id: { type: "integer" }, papel: { type: "string", nullable: true }, data_entrada: { type: "string", format: "date-time", nullable: true }, nome: { type: "string", nullable: true }, email: { type: "string", nullable: true }, foto_perfil: { type: "string", nullable: true }, bio: { type: "string", nullable: true } } },
      NovoMembroClube: { type: "object", required: ["usuario_id"], properties: { usuario_id: { type: "integer", minimum: 1 }, papel: { type: "string", default: "membro" } } },
      PapelMembro: { type: "object", required: ["papel"], properties: { papel: { type: "string", minLength: 1 } } },
      Postagem: { type: "object", properties: {
        id: { type: "integer" }, tipo: { type: "string", nullable: true }, titulo: { type: "string", nullable: true }, conteudo: { type: "string", nullable: true }, avaliacao: { type: "number", minimum: 0, maximum: 5, nullable: true },
        usuario_id: { type: "integer", nullable: true }, clube_id: { type: "integer", nullable: true }, livro_id: { type: "integer", nullable: true }, data_criacao: { type: "string", format: "date-time", nullable: true }, data_atualizacao: { type: "string", format: "date-time", nullable: true },
        nome_usuario: { type: "string", nullable: true }, nome_clube: { type: "string", nullable: true }, titulo_livro: { type: "string", nullable: true },
      } },
      NovaPostagem: { type: "object", properties: { tipo: { type: "string", maxLength: 20 }, titulo: { type: "string", maxLength: 200 }, conteudo: { type: "string" }, avaliacao: { type: "number", minimum: 0, maximum: 5, nullable: true }, usuario_id: { type: "integer", minimum: 1 }, livro_id: { type: "integer", minimum: 1, nullable: true } } },
      AtualizaPostagem: { type: "object", minProperties: 1, properties: { titulo: { type: "string", maxLength: 200 }, conteudo: { type: "string" }, avaliacao: { type: "number", minimum: 0, maximum: 5, nullable: true } } },
      Recomendacao: { type: "object", properties: { id: { type: "integer" }, postagem_id: { type: "integer", nullable: true }, usuario_id: { type: "integer", nullable: true }, livro_id: { type: "integer", nullable: true }, data_criacao: { type: "string", format: "date-time", nullable: true }, nome_usuario: { type: "string", nullable: true }, titulo_livro: { type: "string", nullable: true }, titulo_postagem: { type: "string", nullable: true } } },
      NovaRecomendacao: { type: "object", required: ["postagem_id", "usuario_id", "livro_id"], properties: { postagem_id: { type: "integer", minimum: 1 }, usuario_id: { type: "integer", minimum: 1 }, livro_id: { type: "integer", minimum: 1 } } },
      RecomendacaoCriada: { type: "object", properties: { mensagem: { type: "string" }, id: { type: "integer" }, postagem_id: { type: "integer" }, usuario_id: { type: "integer" }, livro_id: { type: "integer" }, data_criacao: { type: "string", format: "date-time" } } },
      Amigo: { type: "object", properties: { amizade_id: { type: "integer" }, status: { type: "string", enum: ["aceito"] }, data_criacao: { type: "string", format: "date-time", nullable: true }, usuario_id: { type: "integer" }, nome: { type: "string", nullable: true }, email: { type: "string", nullable: true }, foto_perfil: { type: "string", nullable: true }, bio: { type: "string", nullable: true } } },
      PedidoAmizade: { type: "object", properties: { amizade_id: { type: "integer" }, data_criacao: { type: "string", format: "date-time", nullable: true }, remetente_id: { type: "integer" }, nome: { type: "string", nullable: true }, email: { type: "string", nullable: true }, foto_perfil: { type: "string", nullable: true } } },
      NovoPedidoAmizade: { type: "object", required: ["usuario_id", "amigo_id"], properties: { usuario_id: { type: "integer", minimum: 1 }, amigo_id: { type: "integer", minimum: 1 } } },
      IdMensagem: { type: "object", properties: { mensagem: { type: "string" }, id: { type: "integer" } } },
      MensagemDireta: { type: "object", properties: { id: { type: "integer" }, remetente_id: { type: "integer" }, destinatario_id: { type: "integer" }, conteudo: { type: "string" }, lida: { type: "boolean" }, data_criacao: { type: "string", format: "date-time", nullable: true }, nome_remetente: { type: "string", nullable: true }, nome_destinatario: { type: "string", nullable: true } } },
      NovaMensagemDireta: { type: "object", required: ["remetente_id", "destinatario_id", "conteudo"], properties: { remetente_id: { type: "integer", minimum: 1 }, destinatario_id: { type: "integer", minimum: 1 }, conteudo: { type: "string", minLength: 1 } } },
      MensagemDiretaCriada: { type: "object", properties: { mensagem: { type: "string" }, id: { type: "integer" }, remetente_id: { type: "integer" }, destinatario_id: { type: "integer" }, conteudo: { type: "string" }, lida: { type: "boolean" }, data_criacao: { type: "string", format: "date-time" } } },
      UsuarioId: { type: "object", required: ["usuario_id"], properties: { usuario_id: { type: "integer", minimum: 1 } } },
      NovoComentario: { type: "object", required: ["usuario_id", "conteudo"], properties: { usuario_id: { type: "integer", minimum: 1 }, conteudo: { type: "string", minLength: 1 } } },
      ConteudoComentario: { type: "object", required: ["conteudo"], properties: { conteudo: { type: "string", minLength: 1 } } },
      Comentario: { type: "object", properties: { id: { type: "integer" }, conteudo: { type: "string", nullable: true }, usuario_id: { type: "integer", nullable: true }, postagem_id: { type: "integer", nullable: true }, data_criacao: { type: "string", format: "date-time", nullable: true }, nome_usuario: { type: "string", nullable: true }, foto_perfil: { type: "string", nullable: true } } },
      ComentarioCriado: { type: "object", properties: { mensagem: { type: "string" }, id: { type: "integer" }, conteudo: { type: "string" }, usuario_id: { type: "integer" }, postagem_id: { type: "integer" }, data_criacao: { type: "string", format: "date-time" } } },
    },
  },
} as const;

export default openapi;
//agora vai