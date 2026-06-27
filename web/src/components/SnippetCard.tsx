import React from "react";
import { Snippet } from "@/lib/api";

interface SnippetCardProps {
  snippet: Snippet;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export default function SnippetCard({ snippet, onDelete, isDeleting }: SnippetCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200 flex flex-col h-full transform hover:-translate-y-1">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate pr-4" title={snippet.title}>
            {snippet.title}
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {snippet.language}
          </span>
        </div>
        
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-md p-3 mb-4 overflow-x-auto border border-gray-100 dark:border-gray-800">
          <pre className="text-sm font-mono text-gray-800 dark:text-gray-300">
            <code>{snippet.code}</code>
          </pre>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {snippet.tags?.split(',').map((tag, i) => {
            const t = tag.trim();
            if (!t) return null;
            return (
              <span key={i} className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                #{t}
              </span>
            )
          })}
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(snippet.created_at).toLocaleDateString()}
        </span>
        <button
          onClick={() => onDelete(snippet.id)}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
