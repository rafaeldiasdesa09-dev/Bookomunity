document.addEventListener("DOMContentLoaded", () => {
    const abas = document.querySelectorAll(".tab-btn");
    const secoes = document.querySelectorAll(".content-section");

    const listaAmigos = document.getElementById("listaAmigos");
    const listaSolicitacoes = document.getElementById("listaSolicitacoes");
    const listaMeusClubes = document.getElementById("listaMeusClubes");

    // Elementos do Formulário de Clube (podem ser null se a aba estiver oculta/removida)
    const btnAbrirFormulario = document.getElementById("btnAbrirFormulario");
    const btnCancelarClube = document.getElementById("btnCancelarClube");
    const formularioClube = document.getElementById("formularioClube");
    const formCriarClube = document.getElementById("formCriarClube");
    const mensagemClube = document.getElementById("mensagemClube");

    const API_AMIGOS = "/api/amigos";
    const API_SOLICITACOES = "/api/usuarios/amigos/pedidos";
    const API_CLUBES = "/api/clubes";

    // --- Alternar entre as abas ---
    function abrirAba(nomeAba) {
        abas.forEach((aba) => {
            aba.classList.toggle("active", aba.dataset.tab === nomeAba);
        });

        secoes.forEach((secao) => {
            secao.classList.toggle("active", secao.id === nomeAba);
        });

        if (nomeAba === "amigos") carregarAmigos();
        if (nomeAba === "solicitacoes") carregarSolicitacoes();
        if (nomeAba === "clubes") carregarMeusClubes();
    }

    abas.forEach((aba) => {
        aba.addEventListener("click", () => {
            abrirAba(aba.dataset.tab);
        });
    });

    // --- Amigos ---
    async function carregarAmigos() {
        if (!listaAmigos) return;
        try {
            listaAmigos.innerHTML = "<p>Carregando amigos...</p>";

            let resposta = await fetch(API_AMIGOS);
            if (!resposta.ok) throw new Error("Não foi possível carregar os amigos.");

            let dados = await resposta.json();
            const amigos = Array.isArray(dados) ? dados : (dados.amigos || dados.data || []);

            if (amigos.length === 0) {
                listaAmigos.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">♧</div>
                        <h3>Suas amizades começam aqui!</h3>
                        <p>Você ainda não possui amigos na sua rede.</p>
                    </div>
                `;
                return;
            }

            listaAmigos.innerHTML = amigos.map((amigo) => `
                <article class="friend-card">
                    <a class="friend-url" href="/user/${amigo.nome_usuario}">
                        <img class="friend-pfp" src="${amigo.foto_perfil || "/img/icon/default-avatar.svg"}" alt="Foto de @${amigo.nome_usuario || amigo.nome}">
                        <div class="friend-info">
                            <h3 style="font-size: 1rem;">${amigo.nome} | @${amigo.nome_usuario}</h3>
                        </div>
                    </a>
                    <div class="card-actions">
                        <button class="reject-btn primary-btn remove-friend-btn" data-id="${amigo.amizade_id}">Remover</button>
                    </div>
                </article>
            `).join("");

            listaAmigos.querySelectorAll(".remove-friend-btn").forEach((botao) => {
                botao.addEventListener("click", () => removerAmizade(botao.dataset.id, false));
            });

        } catch (erro) {
            console.error(erro);
            listaAmigos.innerHTML = "<p>Erro ao carregar seus amigos.</p>";
        }
    }

    // --- Solicitações ---
    async function carregarSolicitacoes() {
        if (!listaSolicitacoes) return;
        try {
            listaSolicitacoes.innerHTML = "<p>Carregando solicitações...</p>";

            let resposta = await fetch(API_SOLICITACOES);
            if (!resposta.ok) resposta = await fetch("/api/amigos/pedidos");
            if (!resposta.ok) throw new Error("Não foi possível carregar as solicitações.");

            let dados = await resposta.json();
            const pedidos = Array.isArray(dados) ? dados : (dados.pedidos || dados.data || []);

            if (pedidos.length === 0) {
                listaSolicitacoes.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">✉</div>
                        <h3>Nenhuma solicitação por enquanto</h3>
                        <p>Когда alguém enviar um pedido de amizade, ele aparecerá aqui.</p>
                    </div>
                `;
                return;
            }

            listaSolicitacoes.innerHTML = pedidos.map((pedido) => `
                <article class="friend-card">
                    <a class="friend-url" href="/user/${pedido.nome_usuario}">
                        <img class="friend-pfp" src="${pedido.foto_perfil || "/img/icon/default-avatar.svg"}" alt="Foto de @${pedido.nome_usuario || pedido.nome}">
                        <div class="friend-info">
                            <h3 style="font-size: 1rem;">${pedido.nome} | @${pedido.nome_usuario}</h3>
                            <p>Deseja se conectar com você.</p>
                        </div>
                    </a>
                    <div class="card-actions">
                        <button class="accept-btn primary-btn" data-id="${pedido.amizade_id}">Aceitar</button>
                        <button class="reject-btn primary-btn" data-id="${pedido.amizade_id}">Recusar</button>
                    </div>
                </article>
            `).join("");

            listaSolicitacoes.querySelectorAll(".accept-btn").forEach((btn) => btn.addEventListener("click", () => aceitarPedido(btn.dataset.id)));
            listaSolicitacoes.querySelectorAll(".reject-btn").forEach((btn) => btn.addEventListener("click", () => removerAmizade(btn.dataset.id, true)));

        } catch (erro) {
            console.error(erro);
            listaSolicitacoes.innerHTML = "<p>Erro ao carregar solicitações.</p>";
        }
    }

    // --- Meus Clubes ---
    async function carregarMeusClubes() {
        if (!listaMeusClubes) return;
        try {
            listaMeusClubes.innerHTML = "<p>Carregando seus clubes...</p>";

            const resposta = await fetch(`${API_CLUBES}/meus`);
            if (!resposta.ok) throw new Error("Erro ao buscar seus clubes.");

            const dados = await resposta.json();
            const clubes = Array.isArray(dados) ? dados : (dados.clubes || []);

            if (clubes.length === 0) {
                listaMeusClubes.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📚</div>
                        <h3>Você não participa de nenhum clube</h3>
                        <p>Crie o seu próprio clube de leitura usando o botão acima!</p>
                    </div>
                `;
                return;
            }

            listaMeusClubes.innerHTML = clubes.map((clube) => `
                <article class="friend-card">
                    <img class="friend-pfp" src="${clube.imagem || clube.foto || "/img/icon/friends.svg"}" alt="Capa do clube ${clube.nome}">
                    <div class="friend-info">
                        <h3>${clube.nome}</h3>
                        <p> #${clube.id}</p>
                    </div>
                    <a href="/clubes/${clube.id}" class="primary-btn clube-btn">Acessar clube</a>
                </article>
            `).join("");

        } catch (erro) {
            console.error(erro);
            listaMeusClubes.innerHTML = "<p>Erro ao carregar seus clubes de leitura.</p>";
        }
    }

    // Controls do Formulário de Clube (Com verificações de segurança)
    if (btnAbrirFormulario && formularioClube) {
        btnAbrirFormulario.addEventListener("click", () => {
            formularioClube.style.display = "block";
        });
    }

    if (btnCancelarClube && formularioClube && formCriarClube) {
        btnCancelarClube.addEventListener("click", () => {
            formularioClube.style.display = "none";
            formCriarClube.reset();
            if (mensagemClube) mensagemClube.textContent = "";
        });
    }

    if (formCriarClube && formularioClube) {
        formCriarClube.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (mensagemClube) mensagemClube.textContent = "Criando clube...";

            // Usa FormData para suportar envio de arquivos de imagem e texto corretamente
            const formData = new FormData();
            formData.append("nome", document.getElementById("nomeClube")?.value.trim() || "");
            formData.append("descricao", document.getElementById("descricaoClube")?.value.trim() || "");

            // Pega o arquivo do input (aceita tanto id="fotoClube" quanto id="imagemClube")
            const inputFile = document.getElementById("fotoClube") || document.getElementById("imagemClube");
            if (inputFile && inputFile.files && inputFile.files[0]) {
                formData.append("foto", inputFile.files[0]);
            }

            try {
                const resposta = await fetch(API_CLUBES, {
                    method: "POST",
                    // IMPORTANTE: Não informe 'Content-Type' ao usar FormData, o navegador cuida do boundary
                    body: formData
                });

                const resultado = await resposta.json();
                if (!resposta.ok) throw new Error(resultado.erro || "Erro ao criar clube.");

                if (mensagemClube) {
                    mensagemClube.style.color = "green";
                    mensagemClube.textContent = "Clube criado com sucesso!";
                }

                formCriarClube.reset();
                setTimeout(() => {
                    formularioClube.style.display = "none";
                    if (mensagemClube) mensagemClube.textContent = "";
                    carregarMeusClubes();
                }, 1500);

            } catch (erro) {
                console.error(erro);
                if (mensagemClube) {
                    mensagemClube.style.color = "red";
                    mensagemClube.textContent = erro.message;
                }
            }
        });
    }

    // --- Ações de Amizade ---
    async function aceitarPedido(id) {
        try {
            const resposta = await fetch(`/api/amizades/${id}`, { method: "PUT" });
            if (!resposta.ok) throw new Error("Erro ao aceitar pedido.");
            carregarSolicitacoes();
            carregarAmigos();
        } catch (erro) {
            console.error(erro);
            alert("Não foi possível aceitar a solicitação.");
        }
    }

    async function removerAmizade(id, solicitacao = false) {
        if (!confirm(solicitacao ? "Deseja recusar esta solicitação?" : "Deseja remover esta amizade?")) return;
        try {
            const resposta = await fetch(`/api/amizades/${id}`, { method: "DELETE" });
            if (!resposta.ok) throw new Error("Erro ao processar.");
            if (solicitacao) carregarSolicitacoes();
            else carregarAmigos();
        } catch (erro) {
            console.error(erro);
            alert("Não foi possível concluir a operação.");
        }
    }

    // Inicialização
    carregarAmigos();
});