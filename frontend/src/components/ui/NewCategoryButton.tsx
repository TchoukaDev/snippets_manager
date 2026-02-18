import { Button } from "./button";

interface NewCategoryButtonProps {
    handleOpenModal: () => void;
}

export function NewCategoryButton({ handleOpenModal }: NewCategoryButtonProps) {
    return (
        <Button
            type="button"
            title='Ajouter une catégorie'
            aria-label='Ajouter une catégorie'

            onClick={handleOpenModal}
        >
            +
        </Button>
    )
}