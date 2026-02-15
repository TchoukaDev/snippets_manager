import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "../ui/dialog";
import { useUpdateCategory } from "@/hooks/useCategories";
import { Input } from "../ui/input";
import type { Category } from "@shared/types";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category;
}

export default function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
    const handleClose = () => {
        setCategoryName('');
        setError(null);
        onClose();
    }
    const { mutate: updateCategory } = useUpdateCategory();
    const [categoryName, setCategoryName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const handleEditCategory = () => {
        setError(null);
        if (!categoryName.trim()) {
            setError("Le nom de la catégorie est requis");
            return;
        }
        updateCategory({ categoryId: category.id, name: categoryName }, {
            onSuccess: () => {
                handleClose();
            },
            onError: (error) => {
                setError(error.message);
            }
        });
    };
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogTitle className="text-center mb-4">Modifier la catégorie</DialogTitle>
                <Field>
                    <DialogDescription className="flex flex-col gap-2">
                        <FieldLabel htmlFor="new-name">Nouveau nom</FieldLabel>
                        <Input type="text" autoFocus defaultValue={category.name} onChange={(e) => setCategoryName(e.target.value)} id="new-name" />
                    </DialogDescription>
                </Field>
                {error && <p className="error">{error}</p>}
                <DialogFooter className="sm:justify-center">
                    <DialogClose asChild>
                        <Button variant="secondary">Annuler</Button>
                    </DialogClose>
                    <Button onClick={handleEditCategory}>Modifier</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog >
    );
}