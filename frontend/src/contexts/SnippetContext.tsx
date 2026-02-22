import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Snippet, Tag } from '@shared/types';
import { useSnippets } from '../hooks/useSnippets';

interface SnippetContextType {
    currentSnippet: Snippet | null;
    setCurrentSnippetId: (id: number | null) => void;
    currentTagIds: number[];
    setCurrentTagIds: (tagIds: number[]) => void;
    snippets: Snippet[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    search: string;
    setSearch: (search: string) => void;
    currentCategoryId: number | null;
    setCurrentCategoryId: (categoryId: number | null) => void;
}

const SnippetContext = createContext<SnippetContextType | null>(null);

export function SnippetProvider({ children }: { children: ReactNode }) {
    const [currentSnippetId, setCurrentSnippetId] = useState<number | null>(null);
    const { data: snippets = [], isLoading, isError, error } = useSnippets();
    const [search, setSearch] = useState('');
    const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
    const [currentTagIds, setCurrentTagIds] = useState<number[]>([]);
    // Dérivé directement du cache React Query → toujours à jour après mutation optimiste
    const currentSnippet = snippets.find((s) => s.id === currentSnippetId) ?? null;


    // Filtrer les snippets par catégorie
    const filterSnippetsByCategory = useCallback((snippets: Snippet[], categoryId: number | null) => {
        if (!categoryId) return snippets;
        return snippets.filter((s) => s.category?.id === categoryId);
    }, []);

    // Filtrer les snippets par tags
    const filterSnippetsByTags = useCallback((snippets: Snippet[], tagIds: number[]) => {
        if (tagIds.length === 0) return snippets;
        return snippets.filter((s) => s.tags.some((t: Tag) => tagIds.includes(t.id)));
    }, []);

    // Filtrer les snippets par recherche après le filtrage par catégorie
    const searchSnippets = useCallback((snippets: Snippet[], search: string) => {
        if (!search) return snippets
        return snippets.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
    }, []);



    const filteredSnippetsByCategory = filterSnippetsByCategory(snippets, currentCategoryId);
    const filteredSnippetsByTags = filterSnippetsByTags(filteredSnippetsByCategory, currentTagIds);
    const searchedSnippets = searchSnippets(filteredSnippetsByTags, search);



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
            currentTagIds,
            setCurrentTagIds,
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
