import type { Snippet } from '@shared/types';
import { useSnippets } from '../hooks/useSnippets';
import { SnippetCard } from './SnippetCard';
import { useState } from 'react';

export function SnippetList() {
    const { data: snippets = [], isLoading, isError, error } = useSnippets();
    const [currentSnippet, setCurrentSnippet] = useState<Snippet | null>(null);

    if (isLoading) return <p>Chargement...</p>;
    if (isError) return <p>Erreur : {error.message}</p>;

    return (
        <div>
            <h1>Snippets</h1>
            <select value={currentSnippet?.id} onChange={(e) => setCurrentSnippet(snippets.find(snippet => snippet.id === Number(e.target.value)) || null)}>
                <option value="">Choisir un snippet</option>
                {snippets.map((snippet: Snippet) => (
                    <option key={snippet.id} value={snippet.id}>{snippet.title}</option>
                ))}
            </select>
            <div>
                {currentSnippet ? <SnippetCard snippet={currentSnippet} /> : <p>Aucun snippet sélectionné</p>}
            </div>
        </div>
    );
}