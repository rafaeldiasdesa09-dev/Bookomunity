
import 'dotenv/config';
import mysql, { Pool } from 'mysql2/promise';


export class Conexao {
    private static pool: Pool | null = null;

    static obterPool(): Pool {
        if (this.pool === null) {
            const host = process.env.DB_HOST;
            const port = process.env.DB_PORT;
            const user = process.env.DB_USER;
            const password = process.env.DB_PASSWORD;
            const database = process.env.DB_NAME;

            if (!host || !port || !user || !password || !database) {
                throw new Error(
                    'Configure DB_HOST, DB_PORT, DB_USER, DB_PASSWORD e DB_NAME no arquivo .env.'
                );
            }

            this.pool = mysql.createPool({
                host,
                port: Number(port),
                user,
                password,
                database,
                charset: 'utf8mb4',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        }

        return this.pool;
    }

    static async encerrar(): Promise<void> {
        if (this.pool !== null) {
            await this.pool.end();
            this.pool = null;
        }
    }
}

const pool = Conexao.obterPool();
export default pool;