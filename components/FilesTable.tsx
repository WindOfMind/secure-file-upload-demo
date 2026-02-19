import { fileTable } from "@/lib/files/fileTable";

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function FileIcon({ type }: { type: string }) {
    if (type.startsWith("image/")) {
        return (
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        );
    }
    if (type === "application/pdf") {
        return (
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
            </svg>
        );
    }
    return (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
        </svg>
    );
}

export default async function FilesTable({ userId }: { userId: number }) {
    const files = await fileTable.getByUserId(userId);

    if (files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 dark:text-zinc-500">
                    <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <div className="space-y-1">
                    <p className="text-zinc-900 dark:text-zinc-50 font-medium text-lg">
                        No files yet
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Upload your first file to get started.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                            Name
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                            Size
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                            Type
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                            Date Added
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right border-b border-zinc-100 dark:border-zinc-800">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {files.map((file) => (
                        <tr
                            key={file.id}
                            className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-all">
                                        <FileIcon type={file.type} />
                                    </div>
                                    <span
                                        className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate max-w-[200px]"
                                        title={file.name}
                                    >
                                        {file.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                {formatBytes(file.size)}
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                {file.type.split("/")[1]?.toUpperCase() ||
                                    "FILE"}
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                {new Date(file.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <a
                                    href={`/api/files/${file.path}`}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
