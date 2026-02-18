"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import userService, { UsernameConflictError } from "@/lib/user/userService";
import authService from "@/lib/auth/authService";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const validation = loginSchema.safeParse({ username, password });

    if (!validation.success) {
        return { error: validation.error.issues[0].message };
    }

    try {
        const user = await userService.verifyPassword(username, password);

        if (!user) {
            return { error: "Invalid username or password" };
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
    } catch (error) {
        console.error("Login action error:", error);
        return { error: "Internal Server Error" };
    }

    redirect("/files");
}

export async function signupAction(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const validation = signupSchema.safeParse({ name, username, password });

    if (!validation.success) {
        return { error: validation.error.issues[0].message };
    }

    try {
        await userService.createUser(name, username, password);
        return { success: true, message: "Account created! Please log in." };
    } catch (error) {
        if (error instanceof UsernameConflictError) {
            return { error: error.message };
        }
        console.error("Signup action error:", error);
        return { error: "Internal Server Error" };
    }
}
