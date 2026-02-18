/**
 * Seed script: creates an admin user with username "admin" and password "admin".
 * Run with: npm run seed:admin
 */

import bcrypt from "bcrypt";
import { DB } from "../lib/db/db";
import { UserTable, UserType } from "../lib/user/userTable";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";
const ADMIN_NAME = "Admin";

async function main() {
    const db = new DB();
    const userTable = new UserTable(db);

    const existing = await userTable.findByUsername(ADMIN_USERNAME);
    if (existing) {
        console.log(
            `Admin user "${ADMIN_USERNAME}" already exists (id=${existing.id}). Skipping.`,
        );
        process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const user = await userTable.insert({
        name: ADMIN_NAME,
        username: ADMIN_USERNAME,
        hashedPassword,
        salt,
        type: UserType.ADMIN,
    });

    console.log(
        `Admin user created successfully (id=${user.id}, username="${user.username}").`,
    );
    process.exit(0);
}

main().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
