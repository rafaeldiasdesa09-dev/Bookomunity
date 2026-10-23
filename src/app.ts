
import express from "express";
import session from "express-session";
import helmet from "helmet";
import path from "path";

import {logger} from "./middlewares/logger"

import pageRoutes from "./routes/pageRoutes";
import registroRoutes from "./routes/authRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

// Cookie e sessão
app.use(
    session({
      secret: "segredo-senac-2026-rafavicnajonasmarvin",
      resave: false,
      saveUninitialized: false,
      cookie: {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
          secure: false
      }
  }));
  
  
  // Middleware de segurança
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcElem: ["'self'", "'unsafe-inline'"],
      }
    }
  })) 

app.use(logger)

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Leitura de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos públicos e fotos de perfil
app.use(express.static(path.join(__dirname, "../public")));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas das páginas
app.use("/", pageRoutes);

// Rotas envolvendo login e sessão /auth/*
app.use("/auth", authRoutes);


export default app;
