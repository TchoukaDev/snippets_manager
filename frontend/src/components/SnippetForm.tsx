import { useState } from 'react';
import { useCreateSnippet } from '../hooks/useSnippets';
import { useCategories } from '../hooks/useCategories';
import { CategoryModal } from './CategoryModal';
import type { Category } from '@shared/types';

export function SnippetForm() {
    const [file, setFile] = useState<File | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);

    const createSnippet = useCreateSnippet();
    const { data: categories = [] } = useCategories();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const title = file.name;
        const format = title.split('.').pop()?.toLowerCase() || '';
        const content = await file.text();

        createSnippet.mutate(
            { title, format, content, categoryId },
            {
                onSuccess: () => {
                    setFile(null);
                    setCategoryId(null);
                },
            }
        );
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                {file && (
                    <div className="form-fields">
                        <div className="category-row">
                            <select
                                value={categoryId ?? ''}
                                onChange={(e) =>
                                    setCategoryId(e.target.value ? Number(e.target.value) : null)
                                }
                            >
                                <option value="">Aucune catégorie</option>
                                {categories?.map((c: Category) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                className="btn-add-category"
                                onClick={() => setIsCategoryModalOpen(true)}
                            >
                                +
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={createSnippet.isPending}
                        >
                            {createSnippet.isPending ? 'Ajout...' : 'Ajouter'}
                        </button>
                    </div>
                )}
            </form>

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
        </>
    );
}