import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { NewSnippet } from '@shared/types';

const QUERY_KEY = ['snippets'];

export function useSnippets() {

    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: api.getSnippets,
    });
}

export function useCreateSnippet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (snippet: NewSnippet) => api.createSnippet(snippet),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}