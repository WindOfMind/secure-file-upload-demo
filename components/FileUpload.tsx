"use client";

import { useState, useRef } from "react";
import { uploadFile } from "@/lib/actions/fileActions";

export default function FileUpload() {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const file = formData.get("file") as File;

        if (!file || file.size === 0) return;

        setUploading(true);
        setMessage(null);

        try {
            const result = await uploadFile(formData);
            if (result?.error) {
                setMessage({ type: "error", text: result.error });
            } else {
                setMessage({
                    type: "success",
                    text: "File uploaded successfully!",
                });
                if (fileInputRef.current) fileInputRef.current.value = "";
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: "An unexpected error occurred.",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <form onSubmit={handleUpload} className="flex gap-2">
                <div className="relative group">
                    <input
                        type="file"
                        name="file"
                        ref={fileInputRef}
                        onChange={() => setMessage(null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="file-upload"
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-all text-sm text-zinc-600 dark:text-zinc-400">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <span>Choose File</span>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-sm"
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </form>
            {message && (
                <p
                    className={`text-xs font-medium ${message.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                >
                    {message.text}
                </p>
            )}
        </div>
    );
}
