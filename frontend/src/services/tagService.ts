import type { NewTag } from "@shared/types";

const API_URL = import.meta.env.VITE_API_URL;

export const tagService = {
    getTags: async () => {
        const response = await fetch(`${API_URL}/tags`);
        if (!response.ok) throw new Error('Erreur chargement tags');
        return response.json();
    },

    createTag: async (tag: NewTag) => {
        const response = await fetch(`${API_URL}/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tag),
        });
        if (!response.ok) throw new Error('Erreur création tag');
        return response.json();
    },

    updateTag: async (id: number, name: string) => {
        const response = await fetch(`${API_URL}/tags/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error('Erreur modification tag');
        return response.json();
    },

    deleteTag: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/tags/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erreur suppression tag');
        // 204 No Content — pas de corps à parser
    },
}