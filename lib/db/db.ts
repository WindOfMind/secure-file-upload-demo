import { Pool, PoolClient } from "pg";

export class DB {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            host: "localhost",
            port: 5432,
            database: process.env.POSTGRES_DB,
        });
    }

    async execute<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        try {
            return await fn(client);
        } finally {
            client.release();
        }
    }
}

const db = new DB();
export default db;
