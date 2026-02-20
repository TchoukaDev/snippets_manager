import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Snippet } from '@shared/types';
import { useSnippets } from '../hooks/useSnippets';

interface SnippetContextType {
    currentSnippet: Snippet | null;
    setCurrentSnippetId: (id: number | null) => void;
    snippets: Snippet[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    search: string;
    setSearch: (search: string) => void;
    currentCategoryId: number | "all" | null;
    setCurrentCategoryId: (categoryId: number | null) => void;
}

const SnippetContext = createContext<SnippetContextType | null>(null);

export function SnippetProvider({ children }: { children: ReactNode }) {
    const [currentSnippetId, setCurrentSnippetId] = useState<number | null>(null);
    const { data: snippets = [], isLoading, isError, error } = useSnippets();
    const [search, setSearch] = useState('');
    const [currentCategoryId, setCurrentCategoryId] = useState<number | "all" | null>(null);
    // Dérivé directement du cache React Query → toujours à jour après mutation optimiste
    const currentSnippet = snippets.find((s) => s.id === currentSnippetId) ?? null;


    // Filtrer les snippets par catégorie
    const filterSnippetsByCategory = useCallback((snippets: Snippet[], categoryId: number | "all" | null) => {
        if (!categoryId || categoryId === "all") return snippets
        return snippets.filter((s) => s.category?.id === categoryId);
    }, []);

    // Filtrer les snippets par recherche après le filtrage par catégorie
    const searchSnippets = useCallback((snippets: Snippet[], search: string) => {
        if (!search) return snippets
        return snippets.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
    }, []);



    const filteredSnippets = filterSnippetsByCategory(snippets, currentCategoryId);
    const searchedSnippets = searchSnippets(filteredSnippets, search);



    return (
        <SnippetContext.Provider value={{
            currentSnippet,
            setCurrentSnippetId,
            snippets: searchedSnippets,
            isLoading,
            isError,
            error: error as Error | null,
            search,
            setSearch,
            currentCategoryId,
            setCurrentCategoryId,
        }}>
            {children}
        </SnippetContext.Provider>
    );
}

export function useSnippetContext() {
    const context = useContext(SnippetContext);
    if (!context) {
        throw new Error('useSnippetContext doit être utilisé dans un SnippetProvider');
    }
    return context;
}
