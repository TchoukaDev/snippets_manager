import { useState } from 'react';
import { useCreateCategory } from '../../hooks/useCategories';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '../ui/dialog';
import { Field } from '../ui/field';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewCategoryModal({ isOpen, onClose }: CategoryModalProps) {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const createCategory = useCreateCategory();

    const handleClose = () => {
        setName('');
        setError(null);
        onClose();
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Un nom est requis');
            return;
        }

        createCategory.mutate(
            { name: name.trim() },
            {
                onSuccess: () => {
                    setName('');
                    onClose();
                },
                onError: (error) => {
                    setError(error.message);
                }
            }
        );
    };

    return createPortal(
        <Dialog open={isOpen} onOpenChange={handleClose}>

            <DialogContent>

                <DialogTitle className="text-center">Ajouter une nouvelle catégorie</DialogTitle>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Field className="max-w-xs mx-auto">

                        <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </Field>
                    {error && <p className="error">{error}</p>}
                    <DialogFooter className='sm:justify-center'>
                        <DialogClose asChild>
                            <Button type="button">
                                Annuler
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={!name.trim() || createCategory.isPending}>
                            {createCategory.isPending ? 'Création...' : 'Créer'}
                        </Button>
                    </DialogFooter>

                    {createCategory.isError && (
                        <p className="error">{createCategory.error.message}</p>
                    )}
                </form>

            </DialogContent>
        </Dialog >,
        document.getElementById('portal-root') as HTMLDivElement
    );
}