import db, { DB } from "@/lib/db/db";

export enum UserType {
    STAFF = "staff",
    ADMIN = "admin",
}

export interface User {
    id: number;
    name: string;
    username: string;
    type: UserType;
}

export interface CreateUserParams {
    name: string;
    username: string;
    hashedPassword: string;
    salt: string;
    type: UserType;
}

export class UserTable {
    constructor(private db: DB) {}

    async findByUsername(username: string): Promise<User | null> {
        return this.db.execute(async (client) => {
            const result = await client.query(
                "SELECT id FROM users WHERE username = $1",
                [username],
            );
            return result.rows[0] ?? null;
        });
    }

    async insert(params: CreateUserParams): Promise<User> {
        const { name, username, hashedPassword, salt, type } = params;
        return this.db.execute(async (client) => {
            const result = await client.query(
                `INSERT INTO users (name, username, password, salt, type)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id, name, username, type
                `,
                [name, username, hashedPassword, salt, type],
            );
            return result.rows[0];
        });
    }
}

const userTable = new UserTable(db);
export default userTable;
