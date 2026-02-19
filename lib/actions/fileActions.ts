"use server";

import { writeFile } from "fs/promises";
import path from "path";
import { fileTable } from "../files/fileTable";
import authService from "../auth/authService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie) redirect("/");

    const userId = await authService.validateSession(sessionCookie.value);
    if (!userId) redirect("/");

    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
        return { error: "No file selected or file is empty" };
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename and add timestamp to avoid collisions
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${Date.now()}-${sanitizedName}`;
        const filesDir = path.join(process.cwd(), "files");
        const filePath = path.join(filesDir, fileName);

        // Ensure directory exists
        const { mkdir } = await import("fs/promises");
        await mkdir(filesDir, { recursive: true });

        await writeFile(filePath, buffer);

        await fileTable.create({
            name: file.name,
            size: file.size,
            type: file.type,
            path: fileName,
            user_id: userId,
        });

        revalidatePath("/files");
        return { success: true };
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to upload file" };
    }
}
