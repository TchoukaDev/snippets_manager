import { useSnippetContext } from "@/contexts/SnippetContext"
import { CategorySelector } from "./CategorySelector"

export function CategorySelectorWrapper() {
    const { currentCategoryId, setCurrentCategoryId } = useSnippetContext()
    return (
        <div>
            <CategorySelector className="w-40" nullable categoryId={currentCategoryId} setCategoryId={setCurrentCategoryId} />
        </div>
    )
}