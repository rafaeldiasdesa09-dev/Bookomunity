import app from "./app";

const PORT = 6767;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});