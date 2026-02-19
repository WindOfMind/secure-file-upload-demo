import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import authService from "@/lib/auth/authService";
import { cookies } from "next/headers";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> },
) {
    const { filename } = await params;
    const filePath = path.join(process.cwd(), "files", filename);

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

        const content = await readFile(filePath);

        // Try to determine content type or default to octet-stream
        const extension = filename.split(".").pop()?.toLowerCase();
        let contentType = "application/octet-stream";

        const mimeTypes: Record<string, string> = {
            pdf: "application/pdf",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            txt: "text/plain",
            json: "application/json",
            zip: "application/zip",
        };

        if (extension && mimeTypes[extension]) {
            contentType = mimeTypes[extension];
        }

        return new NextResponse(content, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `inline; filename="${filename.split("-").slice(1).join("-")}"`,
            },
        });
    } catch (e) {
        console.error("File serve error:", e);
        return new NextResponse("File not found", { status: 404 });
    }
}
