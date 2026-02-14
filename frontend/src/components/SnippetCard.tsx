import type { Snippet } from '@shared/types';
import { CodeBlock } from './CodeBlock';

interface SnippetCardProps {
    snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
    return (
        <li className="snippet-card">
            <h3>{snippet.title}</h3>
            <span className="snippet-format">{snippet.format}</span>
            <CodeBlock content={snippet.content} />
        </li>
    );
}