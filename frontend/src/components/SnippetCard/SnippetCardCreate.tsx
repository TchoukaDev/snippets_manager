import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useCreateSnippet } from '../../hooks/useSnippets';
import { useSnippetContext } from '../../contexts/SnippetContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import CodeBlockEditor from '../CodeBlock/CodeBlockEditor';
import { CategorySelector } from '../CategorySelector/CategorySelector';
import { TagsSelector } from '../TagsSelector/TagsSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const FORMATS = ['js', 'jsx', 'ts', 'tsx', 'css', 'html', 'json', 'md'];

interface SnippetCardCreateProps {
    onCancel: () => void;
    onSaved: () => void;
}

export function SnippetCardCreate({ onCancel, onSaved }: SnippetCardCreateProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [format, setFormat] = useState('ts');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const { mutate: createSnippet } = useCreateSnippet();
    const { setCurrentSnippetId } = useSnippetContext();

    const onSave = () => {
        if (!categoryId) return;

        createSnippet(
            { title, content, format, categoryId, tagIds: selectedTagIds },
            {
                onSuccess: (snippet) => {
                    setCurrentSnippetId(snippet.id);
                    onSaved();
                },
                onError: (error) => console.error(error),
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
                    <Input
                        type="text"
                        className='max-w-xs mx-auto'
                        placeholder='Nom du snippet'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </CardTitle>
                {/* Format */}
                <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className='mx-auto'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {FORMATS.map((f) => (
                            <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* Category */}
                <CategorySelector className='mx-auto' categoryId={categoryId} setCategoryId={setCategoryId} />
                {/* Tags */}
                <div className='flex gap-4 justify-center'>
                    <TagsSelector selectedTagIds={selectedTagIds} onSelectionChange={setSelectedTagIds} />
                </div>
            </CardHeader>
            <CardContent>
                <CodeBlockEditor content={content} format={format} onChange={setContent} />
            </CardContent>
        </Card>
    );
}
