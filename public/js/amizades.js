
document.addEventListener("DOMContentLoaded", () => {
    const abas = document.querySelectorAll(".tab-btn");
    const secoes = document.querySelectorAll(".content-section");

    const listaAmigos = document.getElementById("listaAmigos");
    const listaSolicitacoes = document.getElementById("listaSolicitacoes");

    const API_AMIGOS = "/api/usuarios/amigos";
    const API_SOLICITACOES = "/api/usuarios/amigos/pedidos";

    // Alternar entre as abas
    function abrirAba(nomeAba) {
        abas.forEach((aba) => {
            aba.classList.toggle("active", aba.dataset.tab === nomeAba);
        });

        secoes.forEach((secao) => {
            secao.classList.toggle("active", secao.id === nomeAba);
        });

        if (nomeAba === "amigos") carregarAmigos();
        if (nomeAba === "solicitacoes") carregarSolicitacoes();
    }

    abas.forEach((aba) => {
        aba.addEventListener("click", () => {
            abrirAba(aba.dataset.tab);
        });
    });

    document.querySelectorAll("[data-go-tab]").forEach((botao) => {
        botao.addEventListener("click", () => {
            abrirAba(botao.dataset.goTab);
        });
    });

    // Mostrar amigos
    async function carregarAmigos() {
        try {
            listaAmigos.innerHTML = "<p>Carregando amigos...</p>";

            const resposta = await fetch(API_AMIGOS);

            if (!resposta.ok) {
                throw new Error("Não foi possível carregar os amigos.");
            }

            const amigos = await resposta.json();

            if (amigos.length === 0) {
                listaAmigos.innerHTML = `
                    <div class="empty-icon">♧</div>
                    <h3>Suas amizades começam aqui!</h3>
                    <p>Você ainda não possui amigos. Explore a comunidade e conheça novos leitores.</p>
                    <button class="primary-btn" data-go-tab="encontrar">
                        Encontrar leitores
                    </button>
                `;

                listaAmigos.querySelector("[data-go-tab]")
                    .addEventListener("click", () => abrirAba("encontrar"));

                return;
            }

            listaAmigos.innerHTML = amigos.map((amigo) => `
                <article class="friend-card">
                    <img
                        src="${amigo.foto_perfil || "/img/avatar-padrao.png"}"
                        alt="Foto de ${amigo.nome}"
                    >
                    <div class="friend-info">
                        <h3>${amigo.nome}</h3>
                        <p>${amigo.bio || "Leitor da comunidade Bookomunity"}</p>
                    </div>
                    <button class="remove-friend-btn" data-id="${amigo.amizade_id}">
                        Remover
                    </button>
                </article>
            `).join("");

            listaAmigos.querySelectorAll(".remove-friend-btn").forEach((botao) => {
                botao.addEventListener("click", () => removerAmizade(botao.dataset.id));
            });

        } catch (erro) {
            console.error(erro);
            listaAmigos.innerHTML = "<p>Erro ao carregar seus amigos.</p>";
        }
    }

    // Mostrar solicitações recebidas
    async function carregarSolicitacoes() {
        try {
            listaSolicitacoes.innerHTML = "<p>Carregando solicitações...</p>";

            const resposta = await fetch(API_SOLICITACOES);

            if (!resposta.ok) {
                throw new Error("Não foi possível carregar as solicitações.");
            }

            const pedidos = await resposta.json();

            if (pedidos.length === 0) {
                listaSolicitacoes.innerHTML = `
                    <div class="empty-icon">✉</div>
                    <h3>Nenhuma solicitação por enquanto</h3>
                    <p>Quando alguém enviar um pedido de amizade, ele aparecerá aqui.</p>
                `;
                return;
            }

            listaSolicitacoes.innerHTML = pedidos.map((pedido) => `
                <article class="friend-card">
                    <img
                        src="${pedido.foto_perfil || "/img/avatar-padrao.png"}"
                        alt="Foto de ${pedido.nome}"
                    >
                    <div class="friend-info">
                        <h3>${pedido.nome}</h3>
                        <p>Deseja ser seu amigo.</p>
                    </div>
                    <button class="accept-btn" data-id="${pedido.amizade_id}">
                        Aceitar
                    </button>
                    <button class="reject-btn" data-id="${pedido.amizade_id}">
                        Recusar
                    </button>
                </article>
            `).join("");

            listaSolicitacoes.querySelectorAll(".accept-btn").forEach((botao) => {
                botao.addEventListener("click", () => aceitarPedido(botao.dataset.id));
            });

            listaSolicitacoes.querySelectorAll(".reject-btn").forEach((botao) => {
                botao.addEventListener("click", () => removerAmizade(botao.dataset.id, true));
            });

        } catch (erro) {
            console.error(erro);
            listaSolicitacoes.innerHTML = "<p>Erro ao carregar solicitações.</p>";
        }
    }

    // Aceitar solicitação
    async function aceitarPedido(id) {
        try {
            const resposta = await fetch(`/api/amizades/${id}`, {
                method: "PUT"
            });

            const resultado = await resposta.json();

            if (!resposta.ok) throw new Error(resultado.erro);

            alert("Solicitação aceita!");
            carregarSolicitacoes();

        } catch (erro) {
            console.error(erro);
            alert("Não foi possível aceitar a solicitação.");
        }
    }

    // Remover amizade ou recusar solicitação
    async function removerAmizade(id, solicitacao = false) {
        const confirmacao = confirm(
            solicitacao
                ? "Deseja recusar esta solicitação?"
                : "Deseja remover esta amizade?"
        );

        if (!confirmacao) return;

        try {
            const resposta = await fetch(`/api/amizades/${id}`, {
                method: "DELETE"
            });

            const resultado = await resposta.json();

            if (!resposta.ok) throw new Error(resultado.erro);

            alert(solicitacao ? "Solicitação recusada!" : "Amizade removida!");

            if (solicitacao) carregarSolicitacoes();
            else carregarAmigos();

        } catch (erro) {
            console.error(erro);
            alert("Não foi possível concluir a operação.");
        }
    }

    // Carregar a primeira aba
    carregarAmigos();
});
