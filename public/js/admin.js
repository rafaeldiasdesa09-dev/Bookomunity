const welcome_div = document.getElementById('welcome-content')


document.addEventListener("DOMContentLoaded", async () => {
    try {
        welcome_div.style.display = 'flex'
        const resposta = await fetch("/admin/infos");
        
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados do servidor.");
        }

        const dados = await resposta.json();

        welcome_div.style.display = 'grid'
        welcome_div.innerHTML=`
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
        `

    } catch (erro) {
        console.error("Erro ao carregar painel:", erro);
        alert("Não foi possível atualizar as estatísticas do painel.");
    }
});