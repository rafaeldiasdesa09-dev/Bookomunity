document.addEventListener("DOMContentLoaded", () => {
    const screen_dimming = document.getElementById('dimming');
    const search_bar = document.getElementById('search-bar');
    const search_box_parent = document.getElementById('search-box-parent');
    const header_link = document.querySelectorAll('.header-link');

    if (!search_bar || !screen_dimming || !search_box_parent) {
        return; 
    }

    search_bar.addEventListener('click', () => {
        screen_dimming.style.display = 'initial';
        screen_dimming.style.background = 'rgba(0, 0, 0, 0.3)';
        search_box_parent.style.display = 'flex';
    });

    screen_dimming.addEventListener('click', () => {
        screen_dimming.style.display = 'none';
        search_box_parent.style.display = 'none';
    });

    header_link.forEach(botao => {
        botao.addEventListener('click', () => {
            const rota = botao.getAttribute('data-url');
            if (rota) {
                window.location.href = `/${rota}`;
            }
        });
    });
});