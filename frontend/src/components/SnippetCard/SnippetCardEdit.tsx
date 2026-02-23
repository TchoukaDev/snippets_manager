import type { Snippet } from '@shared/types';
import { Check, X } from 'lucide-react';
import { useUpdateSnippet } from '../../hooks/useSnippets';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import CodeBlockEditor from '../CodeBlock/CodeBlockEditor';
import { CategorySelector } from '../CategorySelector/CategorySelector';
import { TagsSelector } from '../TagsSelector/TagsSelector';

interface SnippetCardEditProps {
    snippet: Snippet;
    onCancel: () => void;
    onSaved: () => void;
}

export function SnippetCardEdit({ snippet, onCancel, onSaved }: SnippetCardEditProps) {
    const [title, setTitle] = useState(snippet.title);
    const [content, setContent] = useState(snippet.content);
    const [categoryId, setCategoryId] = useState<number | null>(snippet.category?.id ?? null);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>(snippet.tags.map(tag => tag.id));
    const [error, setError] = useState<string | null>(null);
    const { mutate: updateSnippet } = useUpdateSnippet();

    const onSave = () => {
        if (!title.trim()) { setError('Le titre est requis'); return; }
        if (!categoryId) { setError('La catégorie est requise'); return; }
        if (!content.trim()) { setError('Le contenu est requis'); return; }
        setError(null);
        updateSnippet(
            { id: snippet.id, title, content, format: snippet.format, categoryId, tagIds: selectedTagIds },
            {
                onSuccess: () => onSaved(),
                onError: (e: Error) => setError(e.message),
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
                <span className="text-muted-foreground text-center">{snippet.format}</span>
                {/* Category */}
                <CategorySelector className='mx-auto' categoryId={categoryId} setCategoryId={setCategoryId} />
                {/* Tags */}
                <div className='flex gap-4 justify-center'>
                    <TagsSelector selectedTagIds={selectedTagIds} onSelectionChange={setSelectedTagIds} />
                </div>
                {/* Error */}
                {error && <p className='error'>{error}</p>}
            </CardHeader>
            <CardContent>
                {/* Content */}
                <CodeBlockEditor content={content} format={snippet.format} onChange={setContent} />
            </CardContent>
        </Card>
    );
}
