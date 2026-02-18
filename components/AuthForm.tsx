"use client";

import { useActionState, useState, useEffect } from "react";
import { loginAction, signupAction } from "@/lib/actions/authActions";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [loginState, loginFormAction, loginPending] = useActionState(
        loginAction,
        null,
    );
    const [signupState, signupFormAction, signupPending] = useActionState(
        signupAction,
        null,
    );

    const error = isLogin ? loginState?.error : signupState?.error;
    const success = !isLogin && signupState?.success;
    const loading = isLogin ? loginPending : signupPending;

    useEffect(() => {
        if (signupState?.success) {
            setIsLogin(true);
        }
    }, [signupState]);

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

            <form
                className="mt-8 space-y-6"
                action={isLogin ? loginFormAction : signupFormAction}
            >
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
                            className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 bg-transparent dark:text-white"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 text-sm rounded-md bg-red-100 text-red-700">
                        {error}
                    </div>
                )}

                {signupState?.message && (
                    <div className="p-3 text-sm rounded-md bg-green-100 text-green-700">
                        {signupState.message}
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
