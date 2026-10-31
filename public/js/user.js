document.addEventListener("DOMContentLoaded", () => {
    const btnEditar = document.getElementById("btnEditarBio");
    const btnCancelar = document.getElementById("btnCancelarBio");

    const bioTexto = document.getElementById("bioTexto");
    const formBio = document.getElementById("formBio");
    const bioInput = document.getElementById("bioInput");

    if (!btnEditar || !btnCancelar || !bioTexto || !formBio || !bioInput) {
        return;
    }

    const userId = 1;

    btnEditar.addEventListener("click", () => {
        bioTexto.style.display = "none";
        btnEditar.style.display = "none";
        formBio.style.display = "block";
    });

    btnCancelar.addEventListener("click", () => {
        bioTexto.style.display = "block";
        btnEditar.style.display = "inline-block";
        formBio.style.display = "none";
    });

    formBio.addEventListener("submit", async (event) => {
        event.preventDefault();

        const novaBio = bioInput.value;

        try {
            const response = await fetch(`/api/usuarios/${userId}/bio`, {
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
});