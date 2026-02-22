import { useSnippetContext } from "@/contexts/SnippetContext";
import { Input } from "./ui/input";

export function SearchSnippet() {
    const { setSearch } = useSnippetContext();
    return (
        <div className="shrink-0">
            <Input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Rechercher un snippet" />
        </div>
    )
}