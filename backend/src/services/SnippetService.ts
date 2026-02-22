import { SnippetRepository } from "../repositories/SnippetRepository";
import { DatabaseError, DuplicateError, NotFoundError, ValidationError } from "../utils/errors";
import type { Snippet } from "../types";
import { normalizeToDb, normalizeToFrontend } from "../utils/NormalizeData";


export class SnippetService {
    constructor(private readonly snippetRepository: SnippetRepository) { }

    /** Retourne tous les snippets avec normalisation des données pour le frontend */
    async getAll(): Promise<Snippet[]> {
        const snippets = await this.snippetRepository.findAll()
        return snippets.map(snippet => ({
            ...snippet,
            title: normalizeToFrontend(snippet.title),
            category: snippet.category ? {
                ...snippet.category,
                name: normalizeToFrontend(snippet.category.name)
            } : null
        }))
    }

    /** Retourne un snippet par son ID ou lève une NotFoundError s'il n'existe pas */
    async getById(id: number): Promise<Snippet> {
        const snippet = await this.snippetRepository.findById(id)
        if (!snippet) {
            throw new NotFoundError("Ce snippet est introuvable")
        }
        return {
            ...snippet,
            title: normalizeToFrontend(snippet.title),
            category: snippet.category ? {
                ...snippet.category,
                name: normalizeToFrontend(snippet.category.name)
            } : null
        }
    }

    /**
     * Crée un nouveau snippet et lui associe ses tags en une seule requête batch.
     * Lève une DuplicateError si le titre existe déjà.
     */
    async create(title: string, content: string, format: string, categoryId: number, tagIds: number[]): Promise<Snippet> {
        if (!title) throw new ValidationError("Un titre est nécessaire")
        if (!content) throw new ValidationError("Le contenu est requis")
        if (!format) throw new ValidationError("Le format du fichier est requis")
        if (!categoryId) throw new ValidationError("Une catégorie est requise")

        try {
            const normalizedTitle = normalizeToDb(title)

            // Création du snippet
            const result = await this.snippetRepository.create(normalizedTitle, content, format, categoryId)
            if (!result.success) {
                throw new DatabaseError("Erreur lors de la création du snippet")
            }

            // Ajout des tags en une seule requête batch
            await this.snippetRepository.addTags(result.id, tagIds)

            return await this.getById(result.id)
        }
        catch (error: any) {
            if (error.cause?.code === 'ER_DUP_ENTRY') {
                throw new DuplicateError("Un snippet avec ce titre existe déjà")
            }
            throw error
        }
    }

    /**
     * Met à jour un snippet et remplace ses tags (stratégie delete & re-insert) :
     * supprime tous les tags existants puis réinsère les nouveaux en batch.
     * Lève une DuplicateError si le nouveau titre existe déjà.
     */
    async update(id: number, title: string, content: string, format: string, categoryId: number, tagIds: number[]): Promise<Snippet> {
        await this.getById(id)

        if (!title) throw new ValidationError("Un titre est nécessaire")
        if (!content) throw new ValidationError("Le contenu est requis")
        if (!format) throw new ValidationError("Le format du fichier est requis")
        if (!categoryId) throw new ValidationError("Une catégorie est requise")

        try {
            const normalizedTitle = normalizeToDb(title)

            // Mise à jour des champs du snippet
            const result = await this.snippetRepository.update(id, normalizedTitle, content, format, categoryId)
            if (!result.success) {
                throw new DatabaseError("Erreur lors de la modification du snippet")
            }

            // Mise à jour des tags : on supprime tout puis on réinsère en batch
            await this.snippetRepository.removeAllTags(id)
            await this.snippetRepository.addTags(id, tagIds)

            return await this.getById(id)
        }
        catch (error: any) {
            if (error.cause?.code === 'ER_DUP_ENTRY') {
                throw new DuplicateError("Un snippet avec ce titre existe déjà")
            }
            throw error
        }
    }

    /** Supprime un snippet par son ID */
    async delete(id: number): Promise<void> {
        await this.getById(id)

        const result = await this.snippetRepository.delete(id)
        if (!result.success) {
            throw new DatabaseError('Erreur lors de la suppression du snippet')
        }
    }
}
