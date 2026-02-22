import type { Tag } from "@shared/types"

import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
} from "@/components/ui/combobox"
import { useTags } from "@/hooks/useTags";

interface TagsSelectorProps {
    selectedTagIds: number[]
    onSelectionChange: (selectedIds: number[]) => void
}

export function TagsSelector({ selectedTagIds, onSelectionChange }: TagsSelectorProps) {
    const { data: tags = [] } = useTags();

    // Convertir les IDs en objets Tag pour le combobox
    const selectedTags = tags.filter((t: Tag) => selectedTagIds.includes(t.id))

    return (
        <Combobox
            items={tags}
            autoHighlight
            multiple
            value={selectedTags}
            onValueChange={(tags: Tag[]) => onSelectionChange(tags.map(t => t.id))}
            itemToStringValue={(tag: Tag) => tag.id.toString()}
            itemToStringLabel={(tag: Tag) => tag.name}
        >
            <ComboboxChips className="w-full max-w-xs">
                <ComboboxValue>
                    {selectedTags.map((tag: Tag) => (
                        <ComboboxChip key={tag.id}>
                            {tag.name}
                        </ComboboxChip>
                    ))}
                </ComboboxValue>
                <ComboboxChipsInput placeholder={selectedTags.length > 0 ? undefined : "Sélectionner des tags"} />
            </ComboboxChips>
            <ComboboxContent>
                <ComboboxEmpty>Aucun résultat.</ComboboxEmpty>
                <ComboboxList>
                    {(tag: Tag) => (
                        <ComboboxItem key={tag.id} value={tag}>
                            {tag.name}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
