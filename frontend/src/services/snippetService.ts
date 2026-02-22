import type { NewSnippetWithTags, Snippet } from "@shared/types";

const API_URL = import.meta.env.VITE_API_URL;

export const snippetService = {
    // Snippets
    getSnippets: async (): Promise<Snippet[]> => {
        const res = await fetch(`${API_URL}/snippets`);
        if (!res.ok) throw new Error('Erreur chargement snippets');
        return res.json();
    },

    createSnippet: async (snippet: NewSnippetWithTags): Promise<Snippet> => {
        const res = await fetch(`${API_URL}/snippets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(snippet),
        });
        if (!res.ok) throw new Error('Erreur création snippet');
        const data = await res.json();
        return data;
    },

    updateSnippet: async (snippet: NewSnippetWithTags): Promise<Snippet> => {
        const res = await fetch(`${API_URL}/snippets/${snippet.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(snippet),
        });
        if (!res.ok) throw new Error('Erreur mise à jour snippet');
        return res.json();
    },

    deleteSnippet: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/snippets/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Erreur suppression snippet');

    },
}