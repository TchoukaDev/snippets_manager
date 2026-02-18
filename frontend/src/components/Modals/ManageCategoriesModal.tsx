import { Dialog, DialogTitle, DialogContent } from "../ui/dialog";
import { useCategories, useDeleteCategory } from "../../hooks/useCategories";
import type { Category } from "@shared/types";
import { Button } from "../ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import EditCategoryModal from "./EditCategoryModal";
import { NewCategoryButton } from "../ui/NewCategoryButton";
import { NewCategoryModal } from "./NewCategoryModal";

export function ManageCategoriesModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { data: categories } = useCategories();
    const { mutate: deleteCategory } = useDeleteCategory();
    const [isOpenNewCategoryModal, setIsOpenNewCategoryModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [category, setCategory] = useState<Category | null>(null);
    const handleDeleteCategory = (categoryId: number) => {
        deleteCategory(categoryId);
    };
    const handleClose = () => {
        setIsOpenEditModal(false);
        setCategory(null);
        onClose();
    }
    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogTitle className="text-center">Gérer les catégories</DialogTitle>
                    <div className="flex justify-center mb-2"><NewCategoryButton handleOpenModal={() => setIsOpenNewCategoryModal(true)} /></div>

                    <div className="flex   flex-wrap divide-x divide-accent gap-4">
                        {categories?.map((category: Category) => (
                            <div key={category.id} className="flex  items-center gap-2 px-4">

                                <p>{category.name}</p>

                                <div className=" flex items-center  gap-2 ">
                                    <Button variant="destructive" size="icon-xs" onClick={() => handleDeleteCategory(category.id)}><Trash2Icon /></Button>
                                    <Button variant="secondary" size="icon-xs" onClick={() => { setIsOpenEditModal(true); setCategory(category); }}><PencilIcon /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
            {category && (
                <EditCategoryModal isOpen={isOpenEditModal} onClose={() => setIsOpenEditModal(false)} category={category} />
            )}
            {isOpenNewCategoryModal && (
                <NewCategoryModal isOpen={isOpenNewCategoryModal} onClose={() => setIsOpenNewCategoryModal(false)} />
            )}
        </>
    );
}