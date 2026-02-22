import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import type { Tag } from "@shared/types";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { useUpdateTag } from "@/hooks/useTags";

interface EditTagModalProps {
    isOpen: boolean;
    onClose: () => void;
    tag: Tag;
}

export default function EditTagModal({ isOpen, onClose, tag }: EditTagModalProps) {
    const handleClose = () => {
        setTagName('');
        setError(null);
        onClose();
    }
    const { mutate: updateTag } = useUpdateTag();
    const [tagName, setTagName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const handleEditCategory = () => {
        setError(null);
        if (!tagName.trim()) {
            setError("Le nom de la catégorie est requis");
            return;
        }
        updateTag({ id: tag.id, name: tagName }, {
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
                        <Input type="text" autoFocus defaultValue={tag.name} onChange={(e) => setTagName(e.target.value)} id="new-name" />
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