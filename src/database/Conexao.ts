// CAMADA: infraestrutura
// Responsabilidade: abrir e encerrar a conexão com o banco.
// É o único arquivo do projeto que conhece as credenciais.

import 'dotenv/config';
import mysql, { Pool } from 'mysql2/promise';

export class Conexao {
  private static pool: Pool | null = null;

  // Cria o pool na primeira chamada e reaproveita nas seguintes.
  static obterPool(): Pool {
    if (this.pool === null) {
      const host = process.env.DB_HOST;
      const port = process.env.DB_PORT;
      const user = process.env.DB_USER;
      const password = process.env.DB_PASSWORD;
      const database = process.env.DB_NAME;

      if (!host || !port || !user || !password || !database) {
        throw new Error(
          'Variáveis de ambiente do banco de dados não foram configuradas corretamente.'
        );
      }

      this.pool = mysql.createPool({
        host,
        port: Number(port),
        user,
        password,
        database,
        charset: 'utf8mb4',
        connectionLimit: 10
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
