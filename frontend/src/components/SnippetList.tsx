import type { Snippet } from '@shared/types';
import { useSnippets } from '../hooks/useSnippets';
import { SnippetCard } from './SnippetCard';

export function SnippetList() {
    const { data: snippets = [], isLoading, isError, error } = useSnippets();

    if (isLoading) return <p>Chargement...</p>;
    if (isError) return <p>Erreur : {error.message}</p>;

    return (
        <div>
            <h1>Snippets</h1>
            <ul>
                {snippets.map((snippet: Snippet) => (
                    <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
            </ul>
        </div>
    );
}