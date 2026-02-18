import type { Snippet } from '@shared/types';
import { CodeBlock } from './CodeBlock';
import { Pencil, Trash2 } from 'lucide-react';
import { useDeleteSnippet } from '../hooks/useSnippets';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const formats: Record<string, string> = {
    'md': 'Markdown',
};

interface SnippetCardViewProps {
    snippet: Snippet;
    onEdit: () => void;
}

export function SnippetCardView({ snippet, onEdit }: SnippetCardViewProps) {
    const deleteSnippet = useDeleteSnippet();

    return (
        <Card>
            <CardHeader className="relative">
                {/* Actions */}
                <div className='absolute right-5 top-0 flex gap-2'>
                    <Button variant="outline" size="icon-lg" onClick={onEdit}><Pencil /></Button>
                    <Button variant="destructive" size="icon-lg" onClick={() => deleteSnippet.mutate(snippet.id)}><Trash2 /></Button>
                </div>
                {/* Title */}
                <CardTitle className='text-lg font-bold text-center'>{snippet.title}</CardTitle>
                {/* Format */}
                <span className="text-muted-foreground text-center">Fichier {formats[snippet.format] ?? snippet.format}</span>
                {snippet.category && <Badge className='mx-auto mt-2'>{snippet.category.name}</Badge>}
            </CardHeader>
            <CardContent>
                {/* Content */}
                <CodeBlock content={snippet.content} format={snippet.format} />
            </CardContent>
        </Card>
    );
}
