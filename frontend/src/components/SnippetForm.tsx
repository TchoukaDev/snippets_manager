import { useState } from 'react';
import { useCreateSnippet } from '../hooks/useSnippets';
import { useCategories } from '../hooks/useCategories';
import { NewCategoryModal } from './Modals/NewCategoryModal';
import type { Category } from '@shared/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import InputFileDemo from './ui/inputFile';
import { Field, FieldLabel } from './ui/field';

export function SnippetForm() {
    const [file, setFile] = useState<File | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const createSnippet = useCreateSnippet();
    const { data: categories = [] } = useCategories();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!file) {
            setError('Un fichier est requis');
            return
        }

        if (!title) {
            setError('Un titre est requis');
            return;
        }
        if (!categoryId) {
            setError('Une catégorie est requise');
            return;
        }
        const format = file.name.split('.').pop()?.toLowerCase() || '';
        const content = await file.text();

        createSnippet.mutate(
            { title, format, content, categoryId },
            {
                onSuccess: () => {
                    setFile(null);
                    setCategoryId(null);
                    setTitle('');
                    setError(null)
                },
                onError: (error) => {
                    setError(error.message);
                }
            }
        );
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="max-w-md flex flex-col gap-6 justify-center items-center">
                    <InputFileDemo

                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />

                    {file && (

                        <div className="flex flex-col gap-6 w-full max-w-xs">
                            <Field >
                                <FieldLabel htmlFor="title">Nom du snippet*</FieldLabel>
                                <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nom" />
                            </Field>
                            <div className='flex gap-4'>
                                <Select
                                    value={categoryId?.toString() ?? undefined}
                                    onValueChange={(value) =>
                                        setCategoryId(value ? Number(value) : null)
                                    }
                                >
                                    <SelectTrigger className='flex-1'> <SelectValue
                                        placeholder="Sélectionnez une catégorie"
                                    /></SelectTrigger>
                                    <SelectContent  >
                                        <SelectGroup>
                                            <SelectLabel>Catégories</SelectLabel>
                                            {categories?.map((c: Category) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Button
                                    type="button"
                                    title='Ajouter une catégorie'
                                    aria-label='Ajouter une catégorie'
                                    className="btn-add-category"
                                    onClick={() => setIsCategoryModalOpen(true)}
                                >
                                    +
                                </Button> </div>


                            {error && (
                                <p className='error'>{error}</p>
                            )}
                            <Button
                                type="submit"
                                disabled={createSnippet.isPending}
                            >
                                {createSnippet.isPending ? 'Ajout...' : 'Ajouter'}
                            </Button>

                        </div>
                    )}
                </div>
            </form>

            <NewCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
        </>
    );
}