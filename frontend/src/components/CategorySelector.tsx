import { Select, SelectValue, SelectTrigger, SelectGroup, SelectItem, SelectContent } from "./ui/select";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "@shared/types";

interface CategorySelectorProps {
    categoryId: number | null;
    setCategoryId: (categoryId: number | null) => void;
    className?: string;
    nullable?: boolean; // Pour le sélecteur global
}

export function CategorySelector({ categoryId, setCategoryId, className, nullable = false }: CategorySelectorProps) {
    const { data: categories = [] } = useCategories();

    // Quand nullable et aucune catégorie sélectionnée → afficher "Toutes les catégories"
    const selectValue = nullable && categoryId === null ? 'all' : categoryId?.toString() ?? undefined;

    return (
        <Select
            value={selectValue}
            onValueChange={(value) =>
                setCategoryId(value === 'all' ? null : Number(value))
            }
        >
            <SelectTrigger className={className}> <SelectValue
                placeholder="Sélectionnez une catégorie"
            /></SelectTrigger>
            <SelectContent position={nullable ? "popper" : "item-aligned"}>
                <SelectGroup>
                    {nullable && <SelectItem value={"all"}>Toutes les catégories</SelectItem>}
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