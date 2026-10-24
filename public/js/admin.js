// ==========================================
// 1. SELETORES DE PÁGINAS E SIDEBAR
// ==========================================
const welcome_div = document.getElementById('welcome-content');
const welcome_page = document.getElementById('welcome');
const database_page = document.getElementById('database');
const console_page = document.getElementById('console');

// Botões da sidebar
const sidebar_db = document.getElementById('sidebar_database');
const sidebar_con = document.getElementById('sidebar_console');
const sidebar_home = document.getElementById('sidebar_home');


// ==========================================
// 2. FUNÇÕES DE EXIBIÇÃO DE PÁGINAS
// ==========================================
function show_database_page() {
    database_page.style.display = 'initial';
    console_page.style.display = 'none';
    welcome_page.style.display = 'none';
}

function show_console_page() {
    database_page.style.display = 'none';
    console_page.style.display = 'initial';
    welcome_page.style.display = 'none';
}

function show_home_page() {
    database_page.style.display = 'none';
    console_page.style.display = 'none';
    welcome_page.style.display = 'initial';
}


// ==========================================
// 3. EVENTOS DOS BOTÕES DA SIDEBAR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    welcome_page.style.display = 'initial';
    database_page.style.display = 'none';
    console_page.style.display = 'none';
    sidebar_home.disabled = true;
});

sidebar_db.addEventListener('click', () => {
    show_database_page();
    sidebar_home.disabled = false;
    sidebar_db.disabled = true;
    sidebar_con.disabled = false;
});

sidebar_con.addEventListener('click', () => {
    show_console_page();
    carregarConsole();
    
    sidebar_home.disabled = false;
    sidebar_db.disabled = false;
    sidebar_con.disabled = true;
});


sidebar_home.addEventListener('click', () => {
    show_home_page();
    sidebar_home.disabled = true;
    sidebar_db.disabled = false;
    sidebar_con.disabled = false;
});

// ==========================================
//                  CONSOLE
// ==========================================

// Função para carregar e exibir o console na tela
async function carregarConsole() {
    const consoleDiv = document.getElementById('console_div');
    if (!consoleDiv) return;

    try {
        const resposta = await fetch('/admin/console');
        
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados do console.");
        }

        const resultado = await resposta.json();

        if (resultado.success && Array.isArray(resultado.data)) {
            if (resultado.data.length === 0) {
                consoleDiv.innerHTML = '<p>Console vazio.</p>';
                return;
            }

             consoleDiv.innerHTML = resultado.data.map(linha => {
                const partes = linha.split('||');
                
                if (partes.length > 1) {
                    return `
                        <div class="console-linha">
                            <span class="console-timestamp">${partes[0]}||</span>
                            <span class="console-texto">${partes[1]}</span>
                        </div>
                    `;
                }
                
                return `<div class="console-linha">${linha}</div>`;
            }).join('');
        } else {
            consoleDiv.innerHTML = '<p style="color: red;">Formato de dados inválido.</p>';
        }

    } catch (erro) {
        console.error("Erro:", erro);
        consoleDiv.innerHTML = '<p style="color: red;">Erro ao carregar o console.</p>';
    }
}

// ==========================================
// 4. LÓGICA DAS TABELAS E ABAS DO BANCO
// ==========================================

// Guarda o último ID de cada tabela para a paginação
let cursores = {
    usuarios: 0,
    livros: 0,
    postagens: 0,
    clubes: 0
};

// Aba que está aberta no momento
let abaAtiva = 'usuarios';

// Elementos da tabela
const container = document.getElementById('tabela-container');
const btnCarregarMais = document.getElementById('btn-carregar-mais');

// Função para buscar os dados no servidor e montar a tabela
async function carregarDados(recurso, pageId = 0, append = false) {
    try {
        const response = await fetch(`/api/${recurso}?page=${pageId}`);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar ${recurso}`);
        }

        const dados = await response.json();

        // Se não vier nenhum dado
        if (dados.length === 0) {
            if (!append) {
                container.innerHTML = `<p style='padding: 2rem; padding-bottom: 3rem'>Nenhum registro encontrado.</p>`;
            } else {
                btnCarregarMais.style.display = 'none';
                alert('Não há mais registros para carregar.');
            }
            return;
        }

        // Salva o ID do último item para continuar a paginação depois
        cursores[recurso] = dados[dados.length - 1].id;

        // Se for a primeira busca, cria a tabela do zero. Senão, adiciona as linhas novas.
        if (!append) {
            container.innerHTML = `
                <table>
                    <thead>
                        ${gerarCabecalho(recurso)}
                    </thead>
                    <tbody id="tabela-tbody">
                        ${gerarLinhas(recurso, dados)}
                    </tbody>
                </table>
            `;
        } else {
            const tbody = document.getElementById('tabela-tbody');
            tbody.innerHTML += gerarLinhas(recurso, dados);
        }

        // Mostra o botão "Carregar Mais" apenas se vieram 50 itens (o limite máximo)
        if (dados.length === 50) {
            btnCarregarMais.style.display = 'block';
        } else {
            btnCarregarMais.style.display = 'none';
        }

    } catch (erro) {
        console.error("Erro:", erro);
        container.innerHTML = `<p style="color: red;">Erro ao carregar os dados.</p>`;
    }
}

// Cria o cabeçalho da tabela dependendo da aba escolhida
function gerarCabecalho(recurso) {
    switch (recurso) {
        case 'usuarios':
            return `<tr class='db_cabecalho'><th>ID</th><th>Nome</th><th>E-mail</th><th>Permissão</th></tr>`;
        case 'livros':
            return `<tr class='db_cabecalho'><th>ID</th><th>Título</th><th>Autor</th><th>Gênero</th><th>Ano</th></tr>`;
        case 'postagens':
            return `<tr class='db_cabecalho'><th>ID</th><th>Tipo</th><th>Título</th><th>Avaliação</th><th>Data de Criação</th></tr>`;
        case 'clubes':
            return `<tr class='db_cabecalho'><th>ID</th><th>Nome</th><th>Descrição</th></tr>`;
        default:
            return '';
    }
}

// Cria as linhas de dados da tabela dependendo da aba escolhida
function gerarLinhas(recurso, itens) {
    return itens.map(item => {
        switch (recurso) {
            case 'usuarios':
                return `
                    <tr class='db_corpo'>
                        <td>${item.id}</td>
                        <td>${item.nome}</td>
                        <td>${item.email}</td>
                        <td>${item.perms}</td>
                    </tr>`;
            case 'livros':
                return `
                    <tr class='db_corpo'>
                        <td>${item.id}</td>
                        <td>${item.titulo}</td>
                        <td>${item.autor}</td>
                        <td>${item.genero}</td>
                        <td>${item.ano_publicacao}</td>
                    </tr>`;
            case 'postagens':
                // Formata a data para o padrão do Brasil
                const dataFormatada = item.data_criacao 
                    ? new Date(item.data_criacao).toLocaleString('pt-BR') 
                    : 'N/A';

                return `
                    <tr class='db_corpo'>
                        <td>${item.id}</td>
                        <td>${item.tipo}</td>
                        <td>${item.titulo}</td>
                        <td>${item.avaliacao ?? 'N/A'}</td>
                        <td>${dataFormatada}</td>
                    </tr>`;
            case 'clubes':
                return `
                    <tr class='db_corpo'>
                        <td>${item.id}</td>
                        <td>${item.nome}</td>
                        <td>${item.descricao}</td>
                    </tr>`;
            default:
                return '';
        }
    }).join('');
}

// Quando clica nos botões de alternar abas da base de dados
document.querySelectorAll('.guia-db').forEach(botao => {
    botao.addEventListener('click', (e) => {
        // Ativa o botão clicado e desativa os outros
        document.querySelectorAll('.guia-db').forEach(b => b.disabled = false);
        e.target.disabled = true;

        // Pega o nome da aba (ex: 'livros')
        abaAtiva = e.target.id.replace('guia-db-', '');

        // Zera o cursor da aba para começar do início
        cursores[abaAtiva] = 0;

        // Carrega os dados do início
        carregarDados(abaAtiva, 0, false);
    });
});

// Quando clica no botão "Carregar Mais"
btnCarregarMais.addEventListener('click', () => {
    carregarDados(abaAtiva, cursores[abaAtiva], true);
});

// Carrega a primeira tabela (usuários) assim que a página abre
carregarDados('usuarios', 0, false);


// ==========================================
// 5. PAINEL DE BOAS-VINDAS / ESTATÍSTICAS
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    if (!welcome_div) return;

    try {
        welcome_div.style.display = 'flex';
        const resposta = await fetch("/admin/infos");
        
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados do servidor.");
        }

        const dados = await resposta.json();

        // Insere os contadores na tela
        welcome_div.style.display = 'grid';
        welcome_div.innerHTML = `
            <div class="welcome-content-block">
                <h3>Usuários cadastrados</h3>
                <p>${dados.total_usuarios}</p>
            </div>
            <div class="welcome-content-block">
                <h3>Total de postagens</h3>
                <p>${dados.total_postagens}</p>
            </div>
            <div class="welcome-content-block">
                <h3>Total de clubes</h3>
                <p>${dados.total_clubes}</p>
            </div>
            <div class="welcome-content-block">
                <h3>Livros cadastrados</h3>
                <p>${dados.total_livros}</p>
            </div>
        `;

    } catch (erro) {
        console.error("Erro ao carregar painel:", erro);
        alert("Não foi possível atualizar as estatísticas do painel.");
    }
});