import db, { DB } from "@/lib/db/db";

export interface Session {
    id: string;
    userId: number;
    expiresAt: Date;
}

export class SessionTable {
    constructor(private db: DB) {}

    async insert(id: string, userId: number, expiresAt: Date): Promise<void> {
        return this.db.execute(async (client) => {
            await client.query(
                "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
                [id, userId, expiresAt],
            );
        });
    }

    async findById(id: string): Promise<Session | null> {
        return this.db.execute(async (client) => {
            const result = await client.query(
                'SELECT id, user_id as "userId", expires_at as "expiresAt" FROM sessions WHERE id = $1',
                [id],
            );
            return result.rows[0] ?? null;
        });
    }

    async delete(id: string): Promise<void> {
        return this.db.execute(async (client) => {
            await client.query("DELETE FROM sessions WHERE id = $1", [id]);
        });
    }
}

const sessionTable = new SessionTable(db);
export default sessionTable;
