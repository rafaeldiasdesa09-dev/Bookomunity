import app from "./app";

const PORT = 6767;

app.listen(PORT, () => {
    setTimeout(() => {console.log(`Servidor rodando em http://localhost:${PORT}`);}, 1500)
});