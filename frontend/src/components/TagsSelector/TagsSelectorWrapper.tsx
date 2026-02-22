import { useSnippetContext } from "@/contexts/SnippetContext";
import { TagsSelector } from "./TagsSelector";

export function TagsSelectorWrapper() {
    const { currentTagIds, setCurrentTagIds } = useSnippetContext();
    return (
        <div>
            <TagsSelector selectedTagIds={currentTagIds} onSelectionChange={setCurrentTagIds} />
        </div>
    )
}