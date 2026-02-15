import type { Snippet } from '@shared/types';
import { useSnippets } from '../hooks/useSnippets';
import { Button } from './ui/button';

interface SnippetListProps {
    onSelectSnippet: (snippet: Snippet) => void;
}

export function SnippetList({ onSelectSnippet }: SnippetListProps) {
    const { data: snippets = [], isLoading, isError, error } = useSnippets();

    if (isLoading) return <p>Chargement...</p>;
    if (isError) return <p>Erreur : {error.message}</p>;

    return (
        <div className="space-y-4">


            {snippets.map((snippet: Snippet) => (
                <Button variant="ghost" className="text-muted-foreground" key={snippet.id} onClick={() => onSelectSnippet(snippet)}>{snippet.title}</Button>
            ))}

        </div>
    );
}