import type { Snippet } from '@shared/types';
import { Check, X } from 'lucide-react';
import { useUpdateSnippet } from '../hooks/useSnippets';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import CodeBlockEditor from './CodeBlockEditor';
import { CategorySelector } from './CategorySelector';

const formats: Record<string, string> = {
    'md': 'Markdown',
};

interface SnippetCardEditProps {
    snippet: Snippet;
    onCancel: () => void;
    onSaved: () => void;
}

export function SnippetCardEdit({ snippet, onCancel, onSaved }: SnippetCardEditProps) {
    const [title, setTitle] = useState(snippet.title);
    const [content, setContent] = useState(snippet.content);
    const [categoryId, setCategoryId] = useState<number | null>(snippet.category?.id ?? null);
    const { mutate: updateSnippet } = useUpdateSnippet();

    const onSave = () => {
        if (!categoryId) {
            throw new Error('Une catégorie est requise');
        }
        updateSnippet(
            { id: snippet.id, title, content, format: snippet.format, categoryId },
            {
                onSuccess: () => onSaved(),
                onError: (error: Error) => console.error(error),
            }
        );
    };

    return (
        <Card>
            <CardHeader className="relative">
                {/* Actions */}
                <div className='absolute right-5 top-0 flex gap-2'>
                    <Button variant="default" size="icon-lg" onClick={onSave}><Check /></Button>
                    <Button variant="outline" size="icon-lg" onClick={onCancel}><X /></Button>
                </div>
                {/* Title */}
                <CardTitle className='text-lg font-bold text-center'>
                    <Input type="text" className='max-w-xs mx-auto' defaultValue={snippet.title} onChange={(e) => setTitle(e.target.value)} />
                </CardTitle>
                {/* Format */}
                <span className="text-muted-foreground text-center">Fichier {formats[snippet.format] ?? snippet.format}</span>
                {/* Category */}
                <CategorySelector className='mx-auto' categoryId={categoryId} setCategoryId={setCategoryId} />
            </CardHeader>
            <CardContent>
                {/* Content */}
                <CodeBlockEditor content={content} format={snippet.format} onChange={setContent} />
            </CardContent>
        </Card>
    );
}
