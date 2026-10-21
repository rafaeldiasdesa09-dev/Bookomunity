
import express from "express";
import helmet from "helmet";
import path from "path";

import {logger} from "./middlewares/logger"
import { pageRoutes } from "./routes/pageRoutes";
import registroRoutes from "./routes/registroRoutes";

const app = express();

// Segurança
app.use(helmet());
app.use(logger)

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Leitura de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos públicos e fotos de perfil
app.use(express.static(path.join(__dirname, "../public")));

// Rotas das páginas
app.use("/", pageRoutes);

// Rota POST /api/registro
app.use("/api", registroRoutes);


export default app;
