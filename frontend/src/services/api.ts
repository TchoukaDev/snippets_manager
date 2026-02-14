import type { Snippet, NewSnippet, Category, NewCategory } from '@shared/types';

const API_URL = 'http://localhost:3001';

export const api = {
    // Snippets
    getSnippets: async (): Promise<Snippet[]> => {
        const res = await fetch(`${API_URL}/snippets`);
        if (!res.ok) throw new Error('Erreur chargement snippets');
        return res.json();
    },

    createSnippet: async (snippet: NewSnippet): Promise<Snippet> => {
        const res = await fetch(`${API_URL}/snippets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(snippet),
        });
        if (!res.ok) throw new Error('Erreur création snippet');
        const data = await res.json();
        return data;
    },

    // Categories
    getCategories: async (): Promise<Category[]> => {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error('Erreur chargement catégories');
        return res.json();
    },

    createCategory: async (category: NewCategory): Promise<Category> => {
        const res = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
        });
        if (!res.ok) throw new Error('Erreur création catégorie');
        return res.json();
    },
};