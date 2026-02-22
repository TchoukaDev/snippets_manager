import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tagService } from "../services/tagService";
import type { Tag } from "@shared/types";

const QUERY_KEY = ['tags'];

export function useTags() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: tagService.getTags,
    });
}

export function useCreateTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tagService.createTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}

export function useUpdateTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, name }: { id: number, name: string }) => tagService.updateTag(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}

export function useDeleteTag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => tagService.deleteTag(id),
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEY });
            const previousTags = queryClient.getQueryData<Tag[]>(QUERY_KEY);

            queryClient.setQueryData(QUERY_KEY, (old: Tag[]) => old.filter(tag => tag.id !== id));

            return { previousTags };
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(QUERY_KEY, context?.previousTags);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}