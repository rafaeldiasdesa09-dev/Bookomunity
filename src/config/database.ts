
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "bookomunity_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testar a conexão e exibir o erro completo
async function testarConexao() {
    let connection;

    try {
        connection = await pool.getConnection();
        console.log("MySQL conectado com sucesso!");
    } catch (erro: unknown) {
        console.error("Falha ao conectar ao MySQL:");

        if (erro instanceof Error) {
            console.error(erro.message);
            console.error("Código:", (erro as NodeJS.ErrnoException).code);
        } else {
            console.error(erro);
        }
    } finally {
        connection?.release();
    }
}

testarConexao();

export default pool;
