// Importar módulos
import express from "express";
import session from "express-session";
import helmet from "helmet";
import path from "path";

// Importar rotas
import { pageRoutes } from "./routes/pageRoutes";


// Facilitar a vida
const app = express();

// Renderizar páginas EJS
app.set("view engine", "ejs"); 

// Apontar automaticamente para a pasta views
app.set("views", "./src/views"); 

// Permitir POST via JSON nn lembro direito
app.use(express.json()); 

// Permitir POST pelo navegador
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));
app.use(pageRoutes);

export default app;