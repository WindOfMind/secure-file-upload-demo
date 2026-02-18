import bcrypt from "bcrypt";
import db, { DB } from "@/lib/db/db";
import { UserTable, User, UserType } from "@/lib/user/userTable";

export class UsernameConflictError extends Error {
    constructor() {
        super("Invalid username. Please choose another one.");
        this.name = "UsernameConflictError";
    }
}

export class UserService {
    private userTable: UserTable;

    constructor(private db: DB) {
        this.userTable = new UserTable(db);
    }

    async createUser(
        name: string,
        username: string,
        password: string,
    ): Promise<User> {
        const existingUser = await this.userTable.findByUsername(username);
        if (existingUser) {
            throw new UsernameConflictError();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return this.userTable.insert({
            name,
            username,
            hashedPassword,
            salt,
            type: UserType.STAFF,
        });
    }
    async tryGetUserId(
        username: string,
        password: string,
    ): Promise<number | null> {
        const user = await this.userTable.findByUsername(username);
        if (!user || !user.password) {
            return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return null;
        }

        return user.id;
    }
}

const userService = new UserService(db);
export default userService;
