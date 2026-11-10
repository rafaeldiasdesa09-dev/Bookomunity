const discussion_post = document.getElementById('discussion-post');
const resenha_post = document.getElementById('resenha-post');
const recomendation_post = document.getElementById('recomendation-post');
const common_post = document.getElementById('common-post');

document.addEventListener('DOMContentLoaded', () => {
    if (resenha_post) resenha_post.style.display = 'none';
    if (recomendation_post) recomendation_post.style.display = 'none';
    if (common_post) common_post.style.display = 'none';

    const btnRemoverClube = document.getElementById('btn-remover-clube');
    const inputClubeId = document.getElementById('clube_id_input');
    const badgeClubeInfo = document.getElementById('clube-badge-info');

    if (btnRemoverClube && inputClubeId) {
        btnRemoverClube.addEventListener('click', () => {
            inputClubeId.value = '';
            if (badgeClubeInfo) {
                badgeClubeInfo.style.display = 'none';
            }
        });
    }

    const formPostagem = document.querySelector('form[action="/api/postagens"]');
    const inputTitulo = document.querySelector('input[name="titulo"]');
    const textareaConteudo = document.querySelector('textarea[name="conteudo"]');
    const postTitulo = document.querySelector('.post-content .post-title');
    const postConteudo = document.querySelector('.post-content .post-text');

    if (formPostagem) {
        formPostagem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });
    }

    if (inputTitulo && postTitulo) {
        inputTitulo.addEventListener('input', (e) => {
            const valor = e.target.value;
            const ativo = document.querySelector('.post:not([style*="display: none"])');
            if (ativo) {
                const tituloAtivo = ativo.querySelector('.post-content .post-title');
                if (tituloAtivo) {
                    tituloAtivo.textContent = valor.trim() === '' ? 'Título' : valor;
                }
            }
        });
    }

    if (textareaConteudo && postConteudo) {
        textareaConteudo.addEventListener('input', (e) => {
            const valor = e.target.value;
            const ativo = document.querySelector('.post:not([style*="display: none"])');
            if (ativo) {
                const textoAtivo = ativo.querySelector('.post-content p.post-text') || ativo.querySelector('.post-content p:not([class])');
                if (textoAtivo) {
                    textoAtivo.textContent = valor.trim() === '' ? 'Corpo da postagem' : valor;
                }
            }
        });
    }

    const btnSelecionarTipo = document.querySelector('.select-type');
    
    let modalTipo = document.getElementById('modal-busca-tipo');
    if (!modalTipo && btnSelecionarTipo) {
        modalTipo = document.createElement('div');
        modalTipo.id = 'modal-busca-tipo';
        modalTipo.className = 'modal-busca-livro';
        modalTipo.style.display = 'none';
        modalTipo.innerHTML = `
            <div class="busca-container">
                <div class="resultados-lista" id="lista-tipos">
                    <div class="item-resultado-livro" data-tipo="DISCUSSAO" data-label="Discussão">Discussão</div>
                    <div class="item-resultado-livro" data-tipo="COMUM" data-label="Comum">Comum</div>
                    <div class="item-resultado-livro" data-tipo="RECOMENDACOES" data-label="Recomendações">Recomendações</div>
                    <div class="item-resultado-livro" data-tipo="RESENHA" data-label="Resenha">Resenha</div>
                </div>
                <button type="button" id="btn-fechar-tipo" class="common-button" style="margin-top: 10px; width: 100%;">Fechar</button>
            </div>
        `;
        btnSelecionarTipo.parentNode.insertBefore(modalTipo, btnSelecionarTipo.nextSibling);
    }

    const btnFecharTipo = document.getElementById('btn-fechar-tipo');
    const inputTipoHidden = document.querySelector('input[name="tipo"]');

    if (btnSelecionarTipo && modalTipo) {
        btnSelecionarTipo.addEventListener('click', () => {
            modalTipo.style.display = 'block';
        });

        if (btnFecharTipo) {
            btnFecharTipo.addEventListener('click', () => {
                modalTipo.style.display = 'none';
            });
        }
    }

    const btnSelecionarLivro = document.getElementById('btn-selecionar-livro') || document.querySelector('button[name="select-book"]');
    const labelLivro = document.querySelector('label[for="select-book"]');
    
    let previewLivro = document.getElementById('livro-selecionado-preview');
    if (!previewLivro && btnSelecionarLivro) {
        previewLivro = document.createElement('div');
        previewLivro.id = 'livro-selecionado-preview';
        previewLivro.className = 'livro-selecionado-preview';
        previewLivro.textContent = 'Nenhum livro selecionado.';
        btnSelecionarLivro.parentNode.insertBefore(previewLivro, btnSelecionarLivro.nextSibling);
    }

    let avaliacaoLabel = formPostagem?.querySelector('label[for="avaliacao"]');
    let avaliacaoInput = formPostagem?.querySelector('input[name="avaliacao"]');

    if (!avaliacaoInput && formPostagem && inputTitulo) {
        avaliacaoInput = document.createElement('input');
        avaliacaoInput.type = 'number';
        avaliacaoInput.name = 'avaliacao';
        avaliacaoInput.min = '1';
        avaliacaoInput.max = '5';
        avaliacaoInput.placeholder = 'Avaliação (1 a 5)';
        
        avaliacaoLabel = document.createElement('label');
        avaliacaoLabel.setAttribute('for', 'avaliacao');
        avaliacaoLabel.textContent = 'Avaliação *';

        formPostagem.insertBefore(avaliacaoLabel, inputTitulo);
        formPostagem.insertBefore(avaliacaoInput, inputTitulo);
    }

    if (avaliacaoInput) {
        avaliacaoInput.addEventListener('input', (e) => {
            const valor = e.target.value;
            if (resenha_post) {
                let postRating = resenha_post.querySelector('.post-content .post-rating');
                const postContent = resenha_post.querySelector('.post-content');
                
                if (!postRating && postContent) {
                    postRating = document.createElement('strong');
                    postRating.className = 'post-rating';
                    const bookTitle = postContent.querySelector('.post-book-title');
                    if (bookTitle) {
                        bookTitle.after(postRating);
                    } else {
                        postContent.prepend(postRating);
                    }
                }

                if (postRating) {
                    postRating.textContent = valor.trim() === '' ? '' : `${valor} estrelas`;
                }
            }
        });
    }

    const atualizarCamposFormulario = (tipoValor) => {
        if (inputTipoHidden) inputTipoHidden.value = tipoValor;
        if (previewLivro) previewLivro.textContent = 'Nenhum livro selecionado.';

        if (btnSelecionarTipo) {
            btnSelecionarTipo.classList.remove(
                'select-button-discussion',
                'select-button-recomendation',
                'select-button-common',
                'select-button-resenha'
            );

            if (tipoValor === 'DISCUSSAO') btnSelecionarTipo.classList.add('select-button-discussion');
            else if (tipoValor === 'RECOMENDACOES') btnSelecionarTipo.classList.add('select-button-recomendation');
            else if (tipoValor === 'COMUM') btnSelecionarTipo.classList.add('select-button-common');
            else if (tipoValor === 'RESENHA') btnSelecionarTipo.classList.add('select-button-resenha');
        }

        const inputLivroIdEl = document.getElementById('livro_id');
        const inputCapaEl = document.getElementById('capa_livro');
        const inputTituloLivroEl = document.getElementById('titulo_livro');
        if (inputLivroIdEl) inputLivroIdEl.value = '';
        if (inputCapaEl) inputCapaEl.value = '';
        if (inputTituloLivroEl) inputTituloLivroEl.value = '';
        if (avaliacaoInput) avaliacaoInput.value = '';

        if (discussion_post) discussion_post.style.display = 'none';
        if (resenha_post) resenha_post.style.display = 'none';
        if (recomendation_post) recomendation_post.style.display = 'none';
        if (common_post) common_post.style.display = 'none';

        let postAtivo = null;
        if (tipoValor === 'DISCUSSAO' && discussion_post) {
            discussion_post.style.display = 'block';
            postAtivo = discussion_post;
        }
        if (tipoValor === 'RESENHA' && resenha_post) {
            resenha_post.style.display = 'block';
            postAtivo = resenha_post;
        }
        if (tipoValor === 'RECOMENDACOES' && recomendation_post) {
            recomendation_post.style.display = 'block';
            postAtivo = recomendation_post;
        }
        if (tipoValor === 'COMUM' && common_post) {
            common_post.style.display = 'block';
            postAtivo = common_post;
        }

        if (postAtivo) {
            const t = postAtivo.querySelector('.post-content .post-title');
            const c = postAtivo.querySelector('.post-content p.post-text') || postAtivo.querySelector('.post-content p:not([class])');
            if (t) t.textContent = 'Título';
            if (c) c.textContent = 'Corpo da postagem';
            const f = postAtivo.querySelector('.photo');
            if (f) f.innerHTML = '';
            const b = postAtivo.querySelector('.post-content .post-book-title');
            if (b) b.textContent = '';
            const r = postAtivo.querySelector('.post-content .post-rating');
            if (r) r.textContent = '';
        }

        if (btnSelecionarLivro) btnSelecionarLivro.style.display = 'none';
        if (labelLivro) labelLivro.style.display = 'none';
        if (previewLivro) previewLivro.style.display = 'none';
        if (avaliacaoInput) avaliacaoInput.style.display = 'none';
        if (avaliacaoLabel) avaliacaoLabel.style.display = 'none';

        if (tipoValor === 'DISCUSSAO') {
            if (btnSelecionarLivro) btnSelecionarLivro.style.display = 'block';
            if (labelLivro) labelLivro.style.display = 'block';
            if (previewLivro) previewLivro.style.display = 'block';
        } else if (tipoValor === 'RESENHA') {
            if (btnSelecionarLivro) btnSelecionarLivro.style.display = 'block';
            if (labelLivro) labelLivro.style.display = 'block';
            if (previewLivro) previewLivro.style.display = 'block';
            if (avaliacaoInput) avaliacaoInput.style.display = 'block';
            if (avaliacaoLabel) avaliacaoLabel.style.display = 'block';
        }
    };

    atualizarCamposFormulario('DISCUSSAO');

    const itensTipo = document.querySelectorAll('#lista-tipos .item-resultado-livro');
    itensTipo.forEach(item => {
        item.addEventListener('click', () => {
            const tipoValor = item.getAttribute('data-tipo');
            const tipoLabel = item.getAttribute('data-label');

            if (btnSelecionarTipo) btnSelecionarTipo.textContent = tipoLabel;
            atualizarCamposFormulario(tipoValor);
            if (modalTipo) modalTipo.style.display = 'none';
        });
    });

    let modalBusca = document.getElementById('modal-busca-livro');
    if (!modalBusca && btnSelecionarLivro) {
        modalBusca = document.createElement('div');
        modalBusca.id = 'modal-busca-livro';
        modalBusca.className = 'modal-busca-livro';
        modalBusca.style.display = 'none';
        modalBusca.innerHTML = `
            <div class="busca-container">
                <input type="text" id="input-pesquisa-livro" placeholder="Digite o nome do livro..." autocomplete="off">
                <div id="resultados-pesquisa" class="resultados-lista"></div>
                <button type="button" id="btn-fechar-busca" class="common-button" style="margin-top: 10px; width: 100%;">Fechar</button>
            </div>
        `;
        btnSelecionarLivro.parentNode.insertBefore(modalBusca, btnSelecionarLivro.nextSibling);
    }

    const inputPesquisa = document.getElementById('input-pesquisa-livro');
    const divResultados = document.getElementById('resultados-pesquisa');
    const btnFechar = document.getElementById('btn-fechar-busca');

    const inputLivroId = document.getElementById('livro_id');
    const inputCapaLivro = document.getElementById('capa_livro');
    const inputTituloLivro = document.getElementById('titulo_livro');

    if (btnSelecionarLivro && modalBusca) {
        btnSelecionarLivro.addEventListener('click', () => {
            modalBusca.style.display = 'block';
            if (inputPesquisa) inputPesquisa.focus();
        });

        if (btnFechar) {
            btnFechar.addEventListener('click', () => {
                modalBusca.style.display = 'none';
            });
        }
    }

    let timeoutId;
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            const termo = e.target.value.trim();

            if (termo.length < 2) {
                divResultados.innerHTML = '';
                return;
            }

            timeoutId = setTimeout(async () => {
                try {
                    const response = await fetch(`/api/livros/buscar?q=${encodeURIComponent(termo)}`);
                    if (!response.ok) throw new Error('Erro na busca');

                    const livros = await response.json();
                    renderizarResultados(livros);
                } catch (error) {
                    console.error('Erro ao buscar livros:', error);
                    divResultados.innerHTML = '<p style="color: red; font-size: 0.8rem; padding: 5px;">Erro ao buscar.</p>';
                }
            }, 300);
        });
    }

    function renderizarResultados(livros) {
        divResultados.innerHTML = '';

        if (livros.length === 0) {
            divResultados.innerHTML = '<p style="font-size: 0.85rem; padding: 5px; color: #666;">Nenhum livro encontrado.</p>';
            return;
        }

        livros.forEach(livro => {
            const item = document.createElement('div');
            item.className = 'item-resultado-livro';

            item.innerHTML = `
                <img src="${livro.capa || '/img/default-avatar.png'}" alt="${livro.titulo}">
                <div class="livro-info">
                    <strong>${livro.titulo}</strong>
                    <small>${livro.autor || 'Autor desconhecido'}</small>
                </div>
            `;

            item.addEventListener('click', () => {
                if (inputLivroId) inputLivroId.value = livro.id || '';
                if (inputCapaLivro) inputCapaLivro.value = livro.capa || '';
                if (inputTituloLivro) inputTituloLivro.value = livro.titulo || '';

                if (previewLivro) {
                    previewLivro.innerHTML = `Livro referenciado: <strong>${livro.titulo}</strong>`;
                }

                const postAtivo = document.querySelector('.post:not([style*="display: none"])');
                if (postAtivo) {
                    const cardFotoDiv = postAtivo.querySelector('.photo');
                    const cardBookTitle = postAtivo.querySelector('.post-content .post-book-title');

                    if (cardFotoDiv) {
                        if (livro.capa) {
                            cardFotoDiv.innerHTML = `<img src="${livro.capa}" style="width: 100%; height: 100%; object-fit: cover;">`;
                        } else {
                            cardFotoDiv.innerHTML = '';
                        }
                    }

                    if (cardBookTitle) {
                        cardBookTitle.textContent = livro.titulo || '';
                    } else if (livro.titulo) {
                        const postContent = postAtivo.querySelector('.post-content');
                        if (postContent) {
                            const h1 = document.createElement('h1');
                            h1.className = 'post-book-title';
                            h1.textContent = livro.titulo;
                            postContent.prepend(h1);
                        }
                    }
                }

                modalBusca.style.display = 'none';
                inputPesquisa.value = '';
                divResultados.innerHTML = '';
            });

            divResultados.appendChild(item);
        });
    }

    if (formPostagem) {
        formPostagem.addEventListener('submit', () => {
            const campos = formPostagem.querySelectorAll('input[type="text"], textarea, input[type="hidden"], input[type="number"]');
            campos.forEach(campo => {
                if (campo.value.trim() === '') {
                    campo.value = '';
                }
            });
        });
    }
});