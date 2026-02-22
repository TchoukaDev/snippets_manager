import { Dialog, DialogTitle, DialogContent } from "../ui/dialog";
import type { Tag } from "@shared/types";
import { Button } from "../ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { NewCategoryOrTagButton } from "../ui/NewCategoryOrTagButton";
import { useDeleteTag, useTags } from "@/hooks/useTags";
import { NewTagModal } from "./NewTagModal";
import EditTagModal from "./EditTagModal";

export function ManageTagsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { data: tags } = useTags();
    const { mutate: deleteTag } = useDeleteTag();
    const [isOpenNewTagModal, setIsOpenNewTagModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [tag, setTag] = useState<Tag | null>(null);

    const handleDeleteTag = (tagId: number) => {
        deleteTag(tagId);
    };
    const handleClose = () => {
        setIsOpenEditModal(false);
        setTag(null);
        onClose();
    }
    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogTitle className="text-center">Gérer les tags</DialogTitle>
                    <div className="flex justify-center mb-2"><NewCategoryOrTagButton handleOpenModal={() => setIsOpenNewTagModal(true)} title='Ajouter un tag' ariaLabel='Ajouter un tag' /></div>

                    <div className="flex   flex-wrap divide-x divide-accent gap-4">
                        {tags?.map((tag: Tag) => (
                            <div key={tag.id} className="flex  items-center gap-2 px-4">

                                <p>{tag.name}</p>

                                <div className=" flex items-center  gap-2 ">
                                    <Button variant="destructive" size="icon-xs" onClick={() => handleDeleteTag(tag.id)}><Trash2Icon /></Button>
                                    <Button variant="secondary" size="icon-xs" onClick={() => { setIsOpenEditModal(true); setTag(tag); }}><PencilIcon /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
            {tag && (
                <EditTagModal isOpen={isOpenEditModal} onClose={() => setIsOpenEditModal(false)} tag={tag} />
            )}
            {isOpenNewTagModal && (
                <NewTagModal isOpen={isOpenNewTagModal} onClose={() => setIsOpenNewTagModal(false)} />
            )}
        </>
    );
}