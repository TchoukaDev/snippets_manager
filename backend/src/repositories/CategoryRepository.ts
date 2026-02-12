import { eq } from "drizzle-orm"
import { db } from "../lib/db"
import { categories } from "../lib/schema"
import type { Category, DeleteResult, InsertResult, UpdateResult } from "../types"


export class CategoryRepository {
    async findAll(): Promise<Category[]> {
        return db.select().from(categories) ?? []
    }

    async findById(categoryId: number): Promise<Category | null> {
        const [result] = await db.select().from(categories).where(eq(categories.id, categoryId))
        return result ?? null
    }

    async create(name: string): Promise<InsertResult> {
        const [result] = await db.insert(categories).values({ name })

        return {
            success: result.affectedRows > 0,
            id: result.insertId
        }
    }

    async update(categoryId: number, name: string): Promise<UpdateResult> {
        const [result] = await db.update(categories).set({ name }).where(eq(categories.id, categoryId))
        return { success: result.affectedRows > 0 }
    }

    async delete(categoryId: number): Promise<DeleteResult> {
        const [result] = await db.delete(categories).where(eq(categories.id, categoryId))
        return { success: result.affectedRows > 0 }
    }
}