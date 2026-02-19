import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import authService from "@/lib/auth/authService";
import { cookies } from "next/headers";
import { fileTable } from "@/lib/files/fileTable";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const fileId = parseInt(id);

    if (isNaN(fileId)) {
        return new NextResponse("Invalid file ID", { status: 400 });
    }

    try {
        // Authenticate the request
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session");
        if (!sessionCookie) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = await authService.validateSession(sessionCookie.value);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch file record and check ownership
        const file = await fileTable.getById(fileId);
        if (!file) {
            return new NextResponse("File not found", { status: 404 });
        }

        if (file.user_id !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const filePath = path.join(process.cwd(), "files", file.path);
        const content = await readFile(filePath);

        return new NextResponse(content, {
            headers: {
                "Content-Type": file.type,
                "Content-Disposition": `inline; filename="${file.name}"`,
            },
        });
    } catch (e) {
        console.error("File serve error:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
