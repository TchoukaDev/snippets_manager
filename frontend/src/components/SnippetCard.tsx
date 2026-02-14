import type { Snippet } from '@shared/types';
import { CodeBlock } from './CodeBlock';
import { Trash2 } from 'lucide-react';
import { useDeleteSnippet } from '../hooks/useSnippets';

interface SnippetCardProps {
    snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
    const deleteSnippet = useDeleteSnippet();
    return (
        <li className="snippet-card">
            <h3>{snippet.title}</h3>
            <div onClick={() => deleteSnippet.mutate(snippet.id)}><Trash2 className='text-red-500 hover:text-red-700 cursor-pointer'></Trash2></div>
            <span className="snippet-format">{snippet.format}</span>
            <CodeBlock content={snippet.content} />
        </li>
    );
}