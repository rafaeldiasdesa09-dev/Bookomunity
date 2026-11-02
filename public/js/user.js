document.addEventListener("DOMContentLoaded", () => {
    const citacoes = [
        { texto: "O verdadeiro segredo de um livro está na leitura atenta de suas entrelinhas.", autor: "Machado de Assis" },
        { texto: "A literatura é a prova de que a vida não basta.", autor: "Fernando Pessoa" },
        { texto: "Lemos para saber que não estamos sozinhos.", autor: "C.S. Lewis" },
        { texto: "Um leitor vive mil vidas antes de morrer.", autor: "George R.R. Martin" },
        { texto: "Não há amigo tão leal quanto um livro.", autor: "Ernest Hemingway" },
        { texto: "Ler é para a mente o que o exercício é para o corpo.", autor: "Joseph Addison" },
        { texto: "Uma casa sem livros é como uma sala sem janelas.", autor: "Heinrich Mann" },
        { texto: "O homem que não lê não tem vantagem sobre quem não sabe ler.", autor: "Mark Twain" },
        { texto: "Ler um bom livro é como marchar em direção a uma revelação.", autor: "Vladimir Nabokov" },
        { texto: "Livros são abelhas que levam o pólen de uma mente a outra.", autor: "James Russell Lowell" },
        { texto: "Há crimes piores do que queimar livros. Um deles é não os ler.", autor: "Ray Bradbury" },
        { texto: "Até eu acreditar em mim mesma, eu precisei que os livros acreditassem por mim.", autor: "Clarice Lispector" },
        { texto: "Um livro deve ser o machado para quebrar o mar congelado dentro de nós.", autor: "Franz Kafka" },
        { texto: "Contar histórias é a maneira que temos de lembrar quem somos.", autor: "Neil Gaiman" },
        { texto: "O mundo é um livro, e quem não viaja lê apenas uma página.", autor: "Santo Agostinho" },
        { texto: "A leitura de todos os bons livros é uma conversa com os maiores pensadores.", autor: "René Descartes" },
        { texto: "Os livros são os amigos mais silenciosos e constantes que existem.", autor: "Charles William Eliot" },
        { texto: "A imaginação é mais importante que o conhecimento limitado.", autor: "Albert Einstein" },
        { texto: "Todo homem é construído sobre ruínas de livros.", autor: "Carlos Fuentes" },
        { texto: "A leitura traz ao homem plenitude; a escrita, exatidão.", autor: "Francis Bacon" },
        { texto: "Falar é uma necessidade, escutar é uma arte, mas ler é sabedoria.", autor: "Writers' Digest" },
        { texto: "Quem mal lê, mal ouve, mal fala, mal vê.", autor: "Monteiro Lobato" },
        { texto: "O que importa não é o que o livro diz, mas o que ele faz por você.", autor: "Ray Bradbury" },
        { texto: "Os livros que o mundo chama de imorais são os que mostram sua própria desonra.", autor: "Oscar Wilde" },
        { texto: "Há mais tesouros nos livros do que em todo o saque dos piratas.", autor: "Walt Disney" },
        { texto: "A leitura de um bom livro é um diálogo em que a alma responde.", autor: "André Maurois" },
        { texto: "Cada livro tem a alma de quem o escreveu e de quem o leu.", autor: "Carlos Ruiz Zafón" },
        { texto: "Diga-me o que lês e eu saberei o que pensas.", autor: "Thomas Carlyle" },
        { texto: "O livro é uma extensão da memória e da imaginação.", autor: "Jorge Luis Borges" },
        { texto: "Entre páginas, encontramos novos mundos.", autor: "Domínio Público" }
    ];

    const indiceAleatorio = Math.floor(Math.random() * citacoes.length);
    const citacaoEscolhida = citacoes[indiceAleatorio];

    const elementQuote = document.getElementById("coverQuote");
    if (elementQuote) {
        elementQuote.innerHTML = `“${citacaoEscolhida.texto}” <br><small style="font-size: 0.6em; opacity: 0.85; display: block; margin-top: 6px;">— ${citacaoEscolhida.autor}</small>`;
    }

    const btnEditar = document.getElementById("btnEditarBio");
    const btnCancelar = document.getElementById("btnCancelarBio");
    const bioTexto = document.getElementById("bioTexto");
    const formBio = document.getElementById("formBio");
    const bioInput = document.getElementById("bioInput");

    if (btnEditar && formBio && bioTexto) {
        btnEditar.addEventListener("click", () => {
            bioTexto.style.display = "none";
            btnEditar.style.display = "none";
            formBio.style.display = "block";
            if (bioInput) bioInput.value = bioTexto.textContent.trim();
        });
    }

    if (btnCancelar && formBio && bioTexto && btnEditar) {
        btnCancelar.addEventListener("click", () => {
            bioTexto.style.display = "block";
            btnEditar.style.display = "inline-block";
            formBio.style.display = "none";
        });
    }

    if (formBio) {
        formBio.addEventListener("submit", async (event) => {
            event.preventDefault();

            const novaBio = bioInput ? bioInput.value : '';

            try {
                const response = await fetch(`/api/usuarios/bio`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bio: novaBio })
                });

                const resultado = await response.json();

                if (response.ok && resultado.success) {
                    bioTexto.textContent = novaBio;
                    formBio.style.display = "none";
                    bioTexto.style.display = "block";
                    btnEditar.style.display = "inline-block";
                } else {
                    alert(resultado.message || 'Erro ao atualizar biografia.');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Erro de conexão com o servidor.');
            }
        });
    }

    const enviarPedido = document.getElementById("submit-add-friend");
    const formPedido = document.getElementById("form-add-friend");
    const pedidoEnviado = document.getElementById("request-sent");

    if (enviarPedido && formPedido && pedidoEnviado) {
        enviarPedido.addEventListener('click', (event) => {
            event.preventDefault();
            formPedido.style.display = 'none';
            pedidoEnviado.style.display = 'initial';
        });
    }
});