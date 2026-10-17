// Importar módulos
import express from "express";
import session from "express-session";
import helmet from "helmet";
import path from "path";

// Importar rotas
import { pageRoutes } from "./routes/pageRoutes";

// Inicializar o express
const app = express();

// Segurança e Sessão (caso vá utilizar)
app.use(helmet());
// app.use(session({ ... })); // Configure sua sessão aqui se precisar

// Configuração do motor de visualização (EJS)
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); // Aponta de forma segura para a pasta src/views

// Middleware para leitura de dados de formulários e JSON
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Servir arquivos estáticos (CSS, imagens, JS do frontend) da pasta public na raiz
app.use(express.static(path.join(__dirname, "../public")));

// Registrar as rotas na raiz da aplicação
app.use("/", pageRoutes);

export default app;