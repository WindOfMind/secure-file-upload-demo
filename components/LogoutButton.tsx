"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await fetch("/api/user/logout", { method: "POST" });
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-lg hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-all disabled:opacity-50"
        >
            {loading ? "Logging out..." : "Log out"}
        </button>
    );
}
