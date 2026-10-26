
const form = document.getElementById("create-post-form");
const tipo = document.getElementById("tipo");
const bookField = document.getElementById("book-field");
const livro = document.getElementById("livro_id");
const bookHelp = document.getElementById("book-help");
const ratingField = document.getElementById("rating-field");
const avaliacao = document.getElementById("avaliacao");
const message = document.getElementById("form-message");
const submitButton = document.getElementById("submit-button");

function atualizarCampos() {
  const isReview = tipo.value === "REVIEW";
  const isRecommendation = tipo.value === "RECOMENDAÇAO";
  const precisaDeLivro = isReview || isRecommendation;

  bookField.hidden = false;
  livro.required = precisaDeLivro;
  bookHelp.textContent = precisaDeLivro
    ? "Selecione o livro relacionado à postagem."
    : "Opcional para discussões.";

  ratingField.hidden = !isReview;
  avaliacao.required = isReview;

  if (!isReview) {
    avaliacao.value = "";
  }
}

tipo.addEventListener("change", atualizarCampos);
atualizarCampos();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "";
  submitButton.disabled = true;
  submitButton.textContent = "Publicando...";

  const dados = {
    tipo: tipo.value,
    titulo: form.titulo.value.trim(),
    conteudo: form.conteudo.value.trim(),
    livro_id: livro.value || null,
    avaliacao: tipo.value === "REVIEW" ? avaliacao.value : null
  };

  try {
    const response = await fetch("/api/postagens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(
        resultado.message || "Não foi possível publicar a postagem."
      );
    }

    message.textContent = "Postagem publicada com sucesso! Voltando ao Explore...";
    form.reset();
    atualizarCampos();

    window.location.href = "/explore";
  } catch (error) {
    message.textContent =
      error.message || "Erro ao publicar. Tente novamente.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Publicar postagem";
  }
});
