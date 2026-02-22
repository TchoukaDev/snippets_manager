import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { NewSnippetWithTags, Snippet } from '@shared/types';
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
        mutationFn: (snippet: NewSnippetWithTags) => snippetService.createSnippet(snippet),
        onMutate: async (snippet: NewSnippetWithTags) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEY });
            const previousSnippets = queryClient.getQueryData<Snippet[]>(QUERY_KEY);

            queryClient.setQueryData(QUERY_KEY, (old: Snippet[]) => [...old, { ...snippet, id: Date.now() }]);
            return { previousSnippets };
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(QUERY_KEY, context?.previousSnippets);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}


export function useUpdateSnippet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (snippet: NewSnippetWithTags) => snippetService.updateSnippet(snippet),
        onMutate: async (snippet: NewSnippetWithTags) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEY });
            const previousSnippets = queryClient.getQueryData<Snippet[]>(QUERY_KEY);
            queryClient.setQueryData(QUERY_KEY, (old: Snippet[]) => old.map(s => s.id === snippet.id ? { ...s, ...snippet } : s));
            return { previousSnippets };
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(QUERY_KEY, context?.previousSnippets);
        },
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