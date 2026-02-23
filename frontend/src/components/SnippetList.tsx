import { useSnippetContext } from '../contexts/SnippetContext';
import { SnippetAccordion } from './SnippetAccordion';

export function SnippetList() {
    const { snippets, isLoading, isError, error, setCurrentSnippetId } = useSnippetContext();

    if (isLoading) return <p>Chargement...</p>;
    if (isError) return <p>Erreur : {error?.message}</p>;

    return <SnippetAccordion snippets={snippets} setCurrentSnippetId={setCurrentSnippetId} />;
}
