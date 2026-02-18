import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Snippet } from '@shared/types';
import { useSnippets } from '../hooks/useSnippets';

interface SnippetContextType {
    currentSnippet: Snippet | null;
    setCurrentSnippetId: (id: number | null) => void;
    snippets: Snippet[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

const SnippetContext = createContext<SnippetContextType | null>(null);

export function SnippetProvider({ children }: { children: ReactNode }) {
    const [currentSnippetId, setCurrentSnippetId] = useState<number | null>(null);
    const { data: snippets = [], isLoading, isError, error } = useSnippets();

    // Dérivé directement du cache React Query → toujours à jour après mutation optimiste
    const currentSnippet = snippets.find((s) => s.id === currentSnippetId) ?? null;

    return (
        <SnippetContext.Provider value={{
            currentSnippet,
            setCurrentSnippetId,
            snippets,
            isLoading,
            isError,
            error: error as Error | null,
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
