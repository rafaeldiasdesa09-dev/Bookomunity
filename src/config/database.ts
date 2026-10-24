import "dotenv/config";
import mysql, { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";

export class Conexao {
    private static pool: Pool | null = null;

    // Cria o pool uma única vez e reutiliza nas consultas
    static obterPool(): Pool {
        if (this.pool === null) {
            this.pool = mysql.createPool({
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
        }

        return this.pool;
    }
}

// Testa a conexão com o banco de dados
export async function testarConexao(): Promise<boolean> {
    let connection: PoolConnection | undefined;

    try {
        const pool = Conexao.obterPool();
        connection = await pool.getConnection();

        const [resultado] = await connection.query<RowDataPacket[]>(
            "SELECT DATABASE() AS banco"
        );

        console.log("==================================");
        console.log("MySQL conectado com sucesso!");
        console.log("Banco de dados:", resultado[0]?.banco);
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

// Exportação padrão para compatibilidade com arquivos que importam pool
const pool = Conexao.obterPool();

export default pool;

// Testa a conexão ao carregar o módulo
void testarConexao();
