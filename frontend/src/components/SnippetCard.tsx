import type { Snippet } from '@shared/types';
import { CodeBlock } from './CodeBlock';
import { Trash2 } from 'lucide-react';
import { useDeleteSnippet } from '../hooks/useSnippets';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface SnippetCardProps {
    snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
    const deleteSnippet = useDeleteSnippet();

    const formats = {
        'md': 'Markdown',
    }

    return (
        <Card>
            <CardHeader className="relative">
                {/* Actions */}
                <Button variant="destructive" size="icon-lg" onClick={() => deleteSnippet.mutate(snippet.id)} className='absolute right-5 top-0'><Trash2 className='size-5'></Trash2>
                </Button>
                {/* Title */}
                <CardTitle className='text-lg font-bold text-center'>{snippet.title}</CardTitle>
                {/* Format */}
                <span className="text-muted-foreground text-center">Fichier {formats[snippet.format as keyof typeof formats]}</span>
            </CardHeader>
            <CardContent>
                {/* Content */}
                <CodeBlock content={snippet.content} />
            </CardContent>
        </Card>
    );
}