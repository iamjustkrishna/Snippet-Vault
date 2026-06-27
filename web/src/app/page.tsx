"use client";

import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import SnippetForm from "@/components/SnippetForm";
import SnippetCard from "@/components/SnippetCard";
import Pagination from "@/components/Pagination";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { fetchSnippets, createSnippet, deleteSnippet, Snippet, SnippetCreate } from "@/lib/api";

const LIMIT = 6;

export default function Home() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadSnippets = useCallback(async (searchQuery: string, pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSnippets(searchQuery, pageNum, LIMIT);
      setSnippets(data);
      // If we got exactly LIMIT items, there might be more. If less, there are definitely no more.
      setHasMore(data.length === LIMIT);
    } catch (err) {
      setError("Failed to load snippets. Ensure the FastAPI backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnippets(query, page);
  }, [query, page, loadSnippets]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const handleCreate = async (data: SnippetCreate) => {
    await createSnippet(data);
    // Reload to page 1 on successful create
    setPage(1);
    setQuery("");
    await loadSnippets("", 1);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteSnippet(id);
      // Reload current page after delete
      await loadSnippets(query, page);
    } catch (err) {
      alert("Failed to delete snippet");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="relative text-center py-10">
          <div className="absolute top-0 right-0">
            <ThemeSwitcher />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">
            Snippet Vault
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Store, search, and manage your code snippets beautifully. Built with Next.js and FastAPI.
          </p>
        </header>

        <SearchBar onSearch={handleSearch} isLoading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <SnippetForm onSubmit={handleCreate} />
          </div>
          
          {/* Right Column: List & Pagination */}
          <div className="lg:col-span-2">
            {error && (
              <div className="p-4 mb-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-center border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : snippets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <p className="text-lg font-medium">No snippets found.</p>
                {query && <p className="text-sm mt-1">Try adjusting your search query.</p>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {snippets.map((snippet) => (
                    <SnippetCard 
                      key={snippet.id} 
                      snippet={snippet} 
                      onDelete={handleDelete}
                      isDeleting={deletingId === snippet.id}
                    />
                  ))}
                </div>
                
                {(page > 1 || hasMore) && (
                  <Pagination 
                    currentPage={page} 
                    onPageChange={setPage} 
                    hasMore={hasMore} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
