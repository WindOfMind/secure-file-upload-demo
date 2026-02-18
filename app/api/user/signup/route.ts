import { NextResponse } from "next/server";
import { z } from "zod";
import userService, { UsernameConflictError } from "@/lib/user/userService";

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = signupSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: validation.error.issues[0].message,
                },
                { status: 400 },
            );
        }

        const { name, username, password } = validation.data;
        const newUser = await userService.createUser(name, username, password);

        return NextResponse.json(
            {
                id: newUser.id,
            },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof UsernameConflictError) {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }

        // TODO: use proper logger that supports structured logging
        console.error("Signup error:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
