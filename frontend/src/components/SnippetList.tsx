import type { Snippet } from '@shared/types';
import { useSnippetContext } from '../contexts/SnippetContext';
import { Button } from './ui/button';

export function SnippetList() {
    const { snippets, isLoading, isError, error, setCurrentSnippetId } = useSnippetContext();

    if (isLoading) return <p>Chargement...</p>;
    if (isError) return <p>Erreur : {error?.message}</p>;

    // Récupérer les catégories sans doublons pour afficher les snippets par catégorie
    const categoriesSet = [...new Set(snippets.map((snippet: Snippet) => snippet.category?.name))];


    return (
        <ul className="list-none space-y-4">
            {categoriesSet.map((category: string | undefined) => category && (<li key={category}>
                <h2 className="mb-2 ">{category}</h2>
                {snippets.filter((snippet: Snippet) => snippet.category?.name === category).map((snippet: Snippet) => (<li key={snippet.id}>
                    <Button variant="ghost" className="text-muted-foreground" onClick={() => setCurrentSnippetId(snippet.id)}>{snippet.title}</Button>
                </li>
                ))}
            </li>
            ))}

        </ul>
    );
}
