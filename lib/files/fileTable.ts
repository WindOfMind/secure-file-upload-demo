import { DB } from "../db/db";

export interface FileRecord {
    id: number;
    name: string;
    size: number;
    type: string;
    path: string;
    user_id: number;
    created_at: Date;
}

export class FileTable {
    constructor(private db: DB) {}

    async create(
        file: Omit<FileRecord, "id" | "created_at">,
    ): Promise<FileRecord> {
        return this.db.execute(async (client) => {
            const result = await client.query(
                "INSERT INTO files (name, size, type, path, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [file.name, file.size, file.type, file.path, file.user_id],
            );
            return result.rows[0];
        });
    }

    async getByUserId(userId: number): Promise<FileRecord[]> {
        return this.db.execute(async (client) => {
            const result = await client.query(
                "SELECT * FROM files WHERE user_id = $1 ORDER BY created_at DESC",
                [userId],
            );
            return result.rows;
        });
    }

    async getById(id: number): Promise<FileRecord | null> {
        return this.db.execute(async (client) => {
            const result = await client.query(
                "SELECT * FROM files WHERE id = $1",
                [id],
            );
            return result.rows[0] || null;
        });
    }
}

import db from "../db/db";
export const fileTable = new FileTable(db);
