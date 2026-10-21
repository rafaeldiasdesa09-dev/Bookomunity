import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Carrega as variáveis do arquivo .env
dotenv.config();

// Configuração do pool de conexões com o MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "bookomunity_db",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    charset: "utf8mb4"
});

// Testa a conexão com o banco de dados
export async function testarConexao(): Promise<boolean> {
    let connection: mysql.PoolConnection | undefined;

    try {
        connection = await pool.getConnection();

        // Confirma qual banco está sendo utilizado
        const [resultado] = await connection.query(
            "SELECT DATABASE() AS banco"
        );

        console.log("==================================");
        console.log("MySQL conectado com sucesso!");
        console.log("Banco de dados:", resultado);
        console.log("==================================");

        return true;
    } catch (erro: unknown) {
        console.error("==================================");
        console.error("ERRO AO CONECTAR AO MYSQL!");

        if (erro instanceof Error) {
            console.error("Mensagem:", erro.message);

            const erroMysql = erro as NodeJS.ErrnoException;

            if (erroMysql.code) {
                console.error("Código:", erroMysql.code);
            }
        } else {
            console.error("Erro desconhecido:", erro);
        }

        console.error("Verifique o arquivo .env e o serviço MySQL.");
        console.error("==================================");

        return false;
    } finally {
        connection?.release();
    }
}

// Exporta o pool para ser utilizado nas rotas da API
export default pool;

// Executa o teste de conexão ao carregar este módulo
void testarConexao();
