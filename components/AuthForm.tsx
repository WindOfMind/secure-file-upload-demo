"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isLogin ? "/api/user/login" : "/api/user/signup";
        const body = isLogin
            ? { username, password }
            : { name, username, password };

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "An error occurred");
                setLoading(false);
                return;
            }

            if (isLogin) {
                router.push("/files");
            } else {
                // After signup, switch to login
                setIsLogin(true);
                setError("Account created! Please log in.");
                setLoading(false);
            }
        } catch (err) {
            setError("Failed to connect to the server");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {isLogin
                        ? "Enter your details to access your files"
                        : "Join us to securely store your files"}
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4 rounded-md shadow-sm">
                    {!isLogin && (
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 bg-transparent dark:text-white"
                            />
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 bg-transparent dark:text-white"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            title="Password"
                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 bg-transparent dark:text-white"
                        />
                    </div>
                </div>

                {error && (
                    <div
                        className={`p-3 text-sm rounded-md ${error.includes("Account created") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                        {error}
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 transition-all duration-200"
                    >
                        {loading
                            ? "Processing..."
                            : isLogin
                              ? "Sign In"
                              : "Sign Up"}
                    </button>
                </div>
            </form>

            <div className="text-center">
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError("");
                    }}
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                >
                    {isLogin
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"}
                </button>
            </div>
        </div>
    );
}
