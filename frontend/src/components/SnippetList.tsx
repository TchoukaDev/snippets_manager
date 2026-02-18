import type { Snippet } from '@shared/types';
import { useSnippetContext } from '../contexts/SnippetContext';
import { Button } from './ui/button';

export function SnippetList() {
    const { snippets, isLoading, isError, error, setCurrentSnippetId } = useSnippetContext();

    if (isLoading) return <p>Chargement...</p>;
    if (isError) return <p>Erreur : {error?.message}</p>;

    return (
        <div className="space-y-4">
            {snippets.map((snippet: Snippet) => (
                <Button variant="ghost" className="text-muted-foreground" key={snippet.id} onClick={() => setCurrentSnippetId(snippet.id)}>{snippet.title}</Button>
            ))}
        </div>
    );
}
