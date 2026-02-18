import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import userService from "@/lib/user/userService";
import authService from "@/lib/auth/authService";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: validation.error.issues[0].message,
                },
                { status: 400 },
            );
        }

        const { username, password } = validation.data;
        const user = await userService.verifyPassword(username, password);

        if (!user) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 },
            );
        }

        const encryptedSessionId = await authService.createSession(user.id);

        const cookieStore = await cookies();
        cookieStore.set("session", encryptedSessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    type: user.type,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
