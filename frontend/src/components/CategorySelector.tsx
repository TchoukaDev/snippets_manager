import { Select, SelectValue, SelectTrigger, SelectGroup, SelectItem, SelectLabel, SelectContent } from "./ui/select";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "@shared/types";

interface CategorySelectorProps {
    categoryId: number | null;
    setCategoryId: (categoryId: number | null) => void;
    className?: string;
}

export function CategorySelector({ categoryId, setCategoryId, className }: CategorySelectorProps) {
    const { data: categories = [] } = useCategories();
    return (
        <Select
            value={categoryId?.toString() ?? undefined}
            onValueChange={(value) =>
                setCategoryId(value ? Number(value) : null)
            }
        >
            <SelectTrigger className={className}> <SelectValue
                placeholder="Sélectionnez une catégorie"
            /></SelectTrigger>
            <SelectContent  >
                <SelectGroup>
                    <SelectLabel>Catégories</SelectLabel>
                    {categories?.map((c: Category) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}