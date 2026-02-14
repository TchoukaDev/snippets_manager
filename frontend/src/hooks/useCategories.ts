import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { NewCategory } from '@shared/types';

const QUERY_KEY = ['categories'];

export function useCategories() {

    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: api.getCategories,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (category: NewCategory) => api.createCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}