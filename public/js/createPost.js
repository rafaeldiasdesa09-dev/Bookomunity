const discussion_post = document.getElementById('discussion-post')
const resenha_post = document.getElementById('resenha-post')
const recomendation_post = document.getElementById('recomendation-post')
const common_post = document.getElementById('common-post')

document.addEventListener('DOMContentLoaded', () => {
    resenha_post.style.display = 'none';
    recomendation_post.style.display = 'none';
    common_post.style.display = 'none';
})


  const inputTitulo = document.querySelector('input[name="titulo"]');
  const textareaConteudo = document.querySelector('textarea[name="conteudo"]');

  const postTitulo = document.querySelector('.post-content .post-title');
  const postConteudo = document.querySelector('.post-content .post-text');

  inputTitulo.addEventListener('input', (e) => {
    const valor = e.target.value;
    postTitulo.textContent = valor.trim() === '' ? 'Título' : valor;
  });

  textareaConteudo.addEventListener('input', (e) => {
    const valor = e.target.value;
    postConteudo.textContent = valor.trim() === '' ? 'Corpo da postagem' : valor;
  });