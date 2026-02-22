import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { SnippetForm } from "../SnippetForm";

export function AddFileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
            <DialogContent>
                <DialogTitle className="text-center mb-4">Ajouter un snippet</DialogTitle>
                <SnippetForm onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
}