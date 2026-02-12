import type { TagRepository } from "../repositories/TagRepository";
import { Tag } from "../types";
import { DatabaseError, NotFoundError, ValidationError } from "../utils/errors";
import { normalizeToDb, normalizeToFrontend } from "../utils/NormalizeData";

export class TagService {
    constructor(private readonly tagRepository: TagRepository) { }

    async getAll(): Promise<Tag[]> {
        const tags = await this.tagRepository.findAll()
        return tags.map(tag => ({
            ...tag,
            name: normalizeToFrontend(tag.name)
        }))
    }
    async getById(id: number): Promise<Tag> {
        const tag = await this.tagRepository.findById(id)
        if (!tag) {
            throw new NotFoundError("Tag introuvable")
        }
        return {
            ...tag,
            name: normalizeToFrontend(tag.name)
        }
    }
    async create(name: string): Promise<Tag> {
        if (!name) {
            throw new ValidationError("Un nom est requis")
        }
        const normalizedName = normalizeToDb(name)
        const result = await this.tagRepository.create(normalizedName)
        if (!result.success) {
            throw new DatabaseError("Erreur lors de la création du tag")
        }
        const tag = await this.getById(result.id)
        return {
            ...tag,
            name: normalizeToFrontend(tag.name)
        }
    }

    async update(id: number, name: string): Promise<Tag> {
        await this.getById(id)
        if (!name) {
            throw new ValidationError("Un nom est requis")
        }

        const normalizedName = normalizeToDb(name)
        const result = await this.tagRepository.update(id, normalizedName)
        if (!result.success) {
            throw new DatabaseError("Erreur lors de la modification du tag")
        }

        const tag = await this.getById(id)
        return {
            ...tag,
            name: normalizeToFrontend(tag.name)
        }
    }

    async delete(id: number): Promise<void> {
        await this.getById(id)

        const result = await this.tagRepository.delete(id)
        if (!result.success) {
            throw new DatabaseError("Erreur lors de la suppression du tag")
        }
    }
}