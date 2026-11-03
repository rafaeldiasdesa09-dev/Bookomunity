const btnSelecionarGenero = document.getElementById('btn-selecionar-genero');
const modalGenero = document.getElementById('modal-busca-genero');
const btnFecharGenero = document.getElementById('btn-fechar-genero');
const inputGeneroHidden = document.getElementById('input-genero-hidden');
const inputPesquisaGenero = document.getElementById('input-pesquisa-genero');

if (btnSelecionarGenero && modalGenero) {
    btnSelecionarGenero.addEventListener('click', () => {
        modalGenero.style.display = 'block';
        if (inputPesquisaGenero) inputPesquisaGenero.focus();
    });

    if (btnFecharGenero) {
        btnFecharGenero.addEventListener('click', () => {
            modalGenero.style.display = 'none';
        });
    }

    const itensGenero = modalGenero.querySelectorAll('.item-resultado-livro');
    itensGenero.forEach(item => {
        item.addEventListener('click', () => {
            const generoValor = item.getAttribute('data-genero');
            const generoLabel = item.getAttribute('data-label');

            btnSelecionarGenero.textContent = generoLabel;
            if (inputGeneroHidden) {
                inputGeneroHidden.value = generoValor;
            }

            modalGenero.style.display = 'none';
            if (inputPesquisaGenero) {
                inputPesquisaGenero.value = '';
                filtrarGeneros('');
            }
        });
    });

    if (inputPesquisaGenero) {
        inputPesquisaGenero.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            filtrarGeneros(termo);
        });
    }
}

function filtrarGeneros(termo) {
    const itens = document.querySelectorAll('#lista-generos .item-resultado-livro');
    itens.forEach(item => {
        const texto = item.textContent.toLowerCase();
        if (texto.includes(termo)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}