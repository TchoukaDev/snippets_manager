import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import type { NewCategory } from '@shared/types';

const QUERY_KEY = ['categories'];

export function useCategories() {

    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: categoryService.getCategories,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (category: NewCategory) => categoryService.createCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}