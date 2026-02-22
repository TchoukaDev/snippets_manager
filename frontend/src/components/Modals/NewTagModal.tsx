import { useState } from 'react';
import { useCreateTag } from '@/hooks/useTags';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '../ui/dialog';
import { Field } from '../ui/field';

interface NewTagModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewTagModal({ isOpen, onClose }: NewTagModalProps) {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { mutate: createTag, isPending } = useCreateTag();

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

        createTag(
            { name: name.trim() },
            {
                onSuccess: () => {
                    setName('');
                    onClose();
                },
                onError: (error: Error) => {
                    setError(error.message);
                }
            }
        );
    };

    return createPortal(
        <Dialog open={isOpen} onOpenChange={handleClose}>

            <DialogContent>

                <DialogTitle className="text-center">Ajouter un nouveau tag</DialogTitle>

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
                        <Button type="submit" disabled={!name.trim() || isPending}>
                            {isPending ? 'Création...' : 'Créer'}
                        </Button>
                    </DialogFooter>


                </form>

            </DialogContent>
        </Dialog >,
        document.getElementById('portal-root') as HTMLDivElement
    );
}