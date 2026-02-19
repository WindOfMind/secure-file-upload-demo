import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import authService from "@/lib/auth/authService";
import LogoutButton from "@/components/LogoutButton";
import FileUpload from "@/components/FileUpload";
import FilesTable from "@/components/FilesTable";

export default async function FilesPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
        redirect("/");
    }

    const userId = await authService.validateSession(sessionCookie.value);
    if (!userId) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
            <header className="flex w-full items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                <div className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
                    SecureFiles
                </div>
                <LogoutButton />
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto p-8 space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Your Files
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400">
                            Manage and access your secure documents.
                        </p>
                    </div>

                    <FileUpload />
                </header>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <FilesTable userId={userId} />
                </div>
            </main>
        </div>
    );
}
