import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import authService from "@/lib/auth/authService";
import LogoutButton from "@/components/LogoutButton";

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

            <main className="flex flex-1 flex-col items-center justify-center p-24">
                <div className="w-full max-w-3xl space-y-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Your Files
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        This is your secure file storage. Start uploading your
                        important documents.
                    </p>
                    <div className="mt-8 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-20 bg-white dark:bg-zinc-900 shadow-sm">
                        <p className="text-zinc-500 dark:text-zinc-500 italic">
                            Empty for now. Implementation of file list coming
                            soon...
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
