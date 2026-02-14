import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { NewSnippet } from '@shared/types';
import { snippetService } from '../services/snippetService';

const QUERY_KEY = ['snippets'];

export function useSnippets() {

    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: snippetService.getSnippets,
    });
}

export function useCreateSnippet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (snippet: NewSnippet) => snippetService.createSnippet(snippet),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}

export function useDeleteSnippet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => snippetService.deleteSnippet(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}