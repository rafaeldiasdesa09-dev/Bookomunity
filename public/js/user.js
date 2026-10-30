
document.addEventListener("DOMContentLoaded", () => {

    const btnEditar = document.getElementById("btnEditarBio");
    const btnCancelar = document.getElementById("btnCancelarBio");

    const bioTexto = document.getElementById("bioTexto");
    const formBio = document.getElementById("formBio");

    // Verifica se os elementos existem na página
    if (!btnEditar || !btnCancelar || !bioTexto || !formBio) {
        return;
    }

    // Abrir edição
    btnEditar.addEventListener("click", () => {
        bioTexto.style.display = "none";
        btnEditar.style.display = "none";
        formBio.style.display = "block";
    });

    // Cancelar edição
    btnCancelar.addEventListener("click", () => {
        bioTexto.style.display = "block";
        btnEditar.style.display = "inline-block";
        formBio.style.display = "none";
    });

});
