import crypto from "crypto";
import sessionTable from "./sessionTable";
import userService from "../user/userService";
import { User } from "../user/userTable";

const ALGORITHM = "aes-256-cbc";
const SECRET =
    process.env.SESSION_SECRET ||
    "0000000000000000000000000000000000000000000000000000000000000000"; // 64 hex chars = 32 bytes

export class AuthService {
    encrypt(text: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            ALGORITHM,
            Buffer.from(SECRET, "hex"),
            iv,
        );
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return `${iv.toString("hex")}:${encrypted}`;
    }

    decrypt(text: string): string {
        const [ivHex, encryptedHex] = text.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            Buffer.from(SECRET, "hex"),
            iv,
        );
        let decrypted = decipher.update(encryptedHex, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }

    async createSession(userId: number): Promise<string> {
        const sessionId = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days session

        await sessionTable.insert(sessionId, userId, expiresAt);
        return this.encrypt(sessionId);
    }

    async validateSession(encryptedSessionId: string): Promise<number | null> {
        try {
            const sessionId = this.decrypt(encryptedSessionId);
            const session = await sessionTable.findById(sessionId);

            if (!session) {
                return null;
            }

            if (new Date() > new Date(session.expiresAt)) {
                await sessionTable.delete(sessionId);
                return null;
            }

            return session.userId;
        } catch (error) {
            console.error("Session validation error:", error);
            return null;
        }
    }
}

const authService = new AuthService();
export default authService;
