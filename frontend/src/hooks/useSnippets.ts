import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { NewSnippet, Snippet } from '@shared/types';
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
        onMutate: async (snippet: NewSnippet) => {
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
        mutationFn: ({ id, title, content, format, categoryId }: { id: number, title: string, content: string, format: string, categoryId: number }) => snippetService.updateSnippet(id, title, content, format, categoryId),
        onMutate: async ({ id, title, content, format, categoryId }: { id: number, title: string, content: string, format: string, categoryId: number }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEY });
            const previousSnippets = queryClient.getQueryData<Snippet[]>(QUERY_KEY);
            queryClient.setQueryData(QUERY_KEY, (old: Snippet[]) => old.map(snippet => snippet.id === id ? { ...snippet, title, content, format, categoryId } : snippet));
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