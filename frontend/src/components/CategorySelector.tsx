import { Select, SelectValue, SelectTrigger, SelectGroup, SelectItem, SelectLabel, SelectContent } from "./ui/select";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "@shared/types";

interface CategorySelectorProps {
    categoryId: number | null;
    setCategoryId: (categoryId: number | "all" | null) => void
    className?: string;
    nullable?: boolean; //Pour le sélecteur global
}

export function CategorySelector({ categoryId, setCategoryId, className, nullable = false }: CategorySelectorProps) {
    const { data: categories = [] } = useCategories();


    return (
        <Select
            value={categoryId?.toString() ?? undefined}
            onValueChange={(value) =>
                setCategoryId(value === "all" ? "all" : value ? Number(value) : null)
            }
        >
            <SelectTrigger className={className}> <SelectValue
                placeholder="Sélectionnez une catégorie"
            /></SelectTrigger>
            <SelectContent position={nullable ? "popper" : "item-aligned"}>
                <SelectGroup>
                    {nullable && <SelectItem value="all">Toutes les catégories</SelectItem>}
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