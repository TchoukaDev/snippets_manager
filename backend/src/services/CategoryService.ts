import type { CategoryRepository } from "../repositories/CategoryRepository";
import { DatabaseError, NotFoundError, ValidationError } from "../utils/errors";
import type { Category } from "../types";
import { normalizeToDb, normalizeToFrontend } from "../utils/NormalizeData";

export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) { }

    async getAll(): Promise<Category[]> {
        const categories = await this.categoryRepository.findAll()
        return categories.map(category => ({
            ...category,
            name: normalizeToFrontend(category.name)
        }))
    }

    async getById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findById(id)
        if (!category) {
            throw new NotFoundError("Catégorie introuvable.")
        }
        return {
            ...category,
            name: normalizeToFrontend(category.name)
        }
    }

    async create(name: string): Promise<Category> {
        if (!name) {
            throw new ValidationError("Un nom est requis")
        }
        const normalizedName = normalizeToDb(name)
        const result = await this.categoryRepository.create(normalizedName)
        if (!result.success) {
            throw new DatabaseError('Erreur lors de la création de la catégorie')
        }
        const category = await this.getById(result.id)
        return {
            ...category,
            name: normalizeToFrontend(category.name)
        }
    }

    async update(id: number, name: string): Promise<Category> {
        await this.getById(id)

        if (!name) {
            throw new ValidationError("Un nom est requis")
        }
        const normalizedName = normalizeToDb(name)
        const result = await this.categoryRepository.update(id, normalizedName)
        if (!result.success) {
            throw new DatabaseError('Erreur lors de la modification de la catégorie')
        }
        const category = await this.getById(id)
        return {
            ...category,
            name: normalizeToFrontend(category.name)
        }
    }

    async delete(id: number): Promise<void> {
        await this.getById(id)

        const result = await this.categoryRepository.delete(id)
        if (!result.success) {
            throw new DatabaseError("Erreur lors de la suppression de la catégorie")
        }
    }
}