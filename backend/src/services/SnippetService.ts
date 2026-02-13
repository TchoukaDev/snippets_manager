
import { SnippetRepository } from "../repositories/SnippetRepository";
import { DatabaseError, DuplicateError, NotFoundError, ValidationError } from "../utils/errors";
import type { TagService } from "./TagService";
import type { Snippet } from "../types";
import { normalizeToDb, normalizeToFrontend } from "../utils/NormalizeData";


export class SnippetService {
    constructor(private readonly snippetRepository: SnippetRepository, private readonly tagService: TagService) { }
    async getAll(): Promise<Snippet[]> {
        const snippets = await this.snippetRepository.findAll()
        return snippets.map(snippet => ({
            ...snippet,
            title: normalizeToFrontend(snippet.title),
        }))

    }

    async getById(id: number): Promise<Snippet> {
        const snippet = await this.snippetRepository.findById(id)
        if (!snippet) {
            throw new NotFoundError("Ce snippet est introuvable")
        } else return {
            ...snippet,
            title: normalizeToFrontend(snippet.title),
        }
    }


    async create(title: string, content: string, format: string, categoryId: number): Promise<Snippet> {
        // Validation des données
        if (!title) {
            throw new ValidationError("Un titre est nécessaire");
        }
        if (!content) {
            throw new ValidationError("Le contenu est requis");
        }
        if (!format) {
            throw new ValidationError("Le format du fichier est requis")
        }
        if (!categoryId) {
            throw new ValidationError("Une catégorie est requise")
        }
        try {
            const normalizedTitle = normalizeToDb(title)

            const result = await this.snippetRepository.create(normalizedTitle, content, format, categoryId);
            if (!result.success) {
                throw new DatabaseError("Erreur lors de la création du snippet")
            }
            const snippet = await this.getById(result.id)
            return {
                ...snippet,
                title: normalizeToFrontend(snippet.title),
            }
        }
        catch (error: any) {
            if (error.cause.code === 'ER_DUP_ENTRY') {
                throw new DuplicateError("Un snippet avec ce titre existe déjà")
            }
            throw error
        }
    }

    async update(id: number, title: string, content: string, format: string, categoryId: number): Promise<Snippet> {

        await this.getById(id)

        if (!title) {
            throw new ValidationError("Un titre est nécessaire");
        }
        if (!content) {
            throw new ValidationError("Le contenu est requis");
        }
        if (!format) {
            throw new ValidationError("Le format du fichier est requis")
        }
        if (!categoryId) {
            throw new ValidationError("Une catégorie est requise")
        }

        try {
            const normalizedTitle = normalizeToDb(title)
            const result = await this.snippetRepository.update(id, normalizedTitle, content, format, categoryId)

            if (!result.success) {
                throw new DatabaseError("Erreur lors de la modification du snippet")
            }
            const snippet = await this.getById(id)
            return {
                ...snippet,
                title: normalizeToFrontend(snippet.title),
            }
        }
        catch (error: any) {
            if (error.cause.code === 'ER_DUP_ENTRY') {
                throw new DuplicateError("Un snippet avec ce titre existe déjà")
            }
            throw error
        }
    }


    async delete(id: number): Promise<void> {
        await this.getById(id)

        const result = await this.snippetRepository.delete(id)
        if (!result.success) {
            throw new DatabaseError('Erreur lors de la suppression du snippet')
        }
    }

    async addTag(snippetId: number, tagId: number): Promise<void> {
        await this.getById(snippetId)
        await this.tagService.getById(tagId)

        const result = await this.snippetRepository.addTag(snippetId, tagId)

        if (!result.success) {
            throw new DatabaseError("Erreur lors de l'ajout du tag")
        }

    }

    async removeTag(snippetId: number, tagId: number): Promise<void> {
        await this.getById(snippetId)
        await this.tagService.getById(tagId)

        const result = await this.snippetRepository.removeTag(snippetId, tagId)
        if (!result.success) {
            throw new DatabaseError("Erreur lors de la suppression du tag")
        }
    }


}