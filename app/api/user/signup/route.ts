import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const { name, username, password, type } = await request.json();

        if (!name || !username || !password || !type) {
            return NextResponse.json(
                {
                    error: "Missing required fields: name, username, password, type",
                },
                { status: 400 },
            );
        }

        if (type !== "admin" && type !== "staff") {
            return NextResponse.json(
                { error: "Invalid type. Must be 'admin' or 'staff'" },
                { status: 400 },
            );
        }

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
                "INSERT INTO users (name, username, password, salt, type) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, username, type",
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
