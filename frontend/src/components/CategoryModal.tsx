import { useState } from 'react';
import { useCreateCategory } from '../hooks/useCategories';
import { createPortal } from 'react-dom';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
    const [name, setName] = useState('');
    const createCategory = useCreateCategory();

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        createCategory.mutate(
            { name: name.trim() },
            {
                onSuccess: () => {
                    setName('');
                    onClose();
                },
            }
        );
    };

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Nouvelle catégorie</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nom de la catégorie"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" disabled={!name.trim() || createCategory.isPending}>
                            {createCategory.isPending ? 'Création...' : 'Créer'}
                        </button>
                    </div>

                    {createCategory.isError && (
                        <p className="error">{createCategory.error.message}</p>
                    )}
                </form>
            </div>
        </div>,
        document.getElementById('modal-root') as HTMLDivElement
    );
}