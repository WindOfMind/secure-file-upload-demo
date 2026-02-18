import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import authService from "@/lib/auth/authService";
import AuthForm from "@/components/AuthForm";

export default async function Home() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (sessionCookie) {
        const userId = await authService.validateSession(sessionCookie.value);
        if (userId) {
            redirect("/files");
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-black font-sans">
            <div className="mb-8 flex flex-col items-center gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                    SecureFiles
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                    The safest place for your documents.
                </p>
            </div>

            <AuthForm />

            <footer className="mt-12 text-zinc-400 text-sm">
                &copy; {new Date().getFullYear()} SecureFiles Inc. All rights
                reserved.
            </footer>
        </div>
    );
}
