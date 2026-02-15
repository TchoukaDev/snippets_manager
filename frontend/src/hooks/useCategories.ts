import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import type { Category, NewCategory } from '@shared/types';

const QUERY_KEY = ['categories'];

export function useCategories() {

    return useQuery<Category[]>({
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

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (categoryId: number) => categoryService.deleteCategory(categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation<Category, Error, { categoryId: number, name: string }>({
        mutationFn: ({ categoryId, name }) => categoryService.updateCategory(categoryId, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}