import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    type: z.enum(["admin", "staff"], {
        message: "Invalid type. Must be 'admin' or 'staff'",
    }),
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

        const { name, username, password, type } = validation.data;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const client = await pool.connect();

        try {
            // Check if user already exists
            const existingUser = await client.query(
                "SELECT id FROM users WHERE username = $1",
                [username],
            );

            if (existingUser.rows.length > 0) {
                return NextResponse.json(
                    { error: "Username already exists" },
                    { status: 409 },
                );
            }

            // Insert new user
            const result = await client.query(
                `INSERT INTO users (name, username, password, salt, type)
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING id, name, username, type
                `,
                [name, username, hashedPassword, salt, type],
            );

            return NextResponse.json(result.rows[0], { status: 201 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
