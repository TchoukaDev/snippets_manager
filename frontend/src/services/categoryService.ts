import type { Category, NewCategory } from '@shared/types';

const API_URL = 'http://localhost:3001';
// Categories
export const categoryService = {
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
}