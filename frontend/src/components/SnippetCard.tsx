import { useState } from 'react';
import { useSnippetContext } from '../contexts/SnippetContext';
import { SnippetCardView } from './SnippetCardView';
import { SnippetCardEdit } from './SnippetCardEdit';

export function SnippetCard() {
    const { currentSnippet: snippet } = useSnippetContext();
    const [isEditing, setIsEditing] = useState(false);

    if (!snippet) return null;

    if (isEditing) {
        return (
            <SnippetCardEdit
                snippet={snippet}
                onCancel={() => setIsEditing(false)}
                onSaved={() => setIsEditing(false)}
            />
        );
    }

    return <SnippetCardView snippet={snippet} onEdit={() => setIsEditing(true)} />;
}
