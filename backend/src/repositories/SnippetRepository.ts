import { and, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { snippets, snippetTags, categories } from "../lib/schema";
import { DeleteResult, InsertResult, Snippet, UpdateResult } from "../types";


export class SnippetRepository {
    async findAll(): Promise<Snippet[]> {

        const result = await db.select({
            id: snippets.id,
            title: snippets.title,
            content: snippets.content,
            format: snippets.format,
            createdAt: snippets.createdAt,
            category: {
                id: categories.id,
                name: categories.name
            }

        }).from(snippets).leftJoin(categories, eq(snippets.categoryId, categories.id))

        return result.map(row => ({
            ...row, category: row.category?.id ? row.category : null
        }))
    }

    async findById(id: number): Promise<Snippet | null> {
        const [result] = await db.select({
            id: snippets.id,
            title: snippets.title,
            content: snippets.content,
            format: snippets.format,
            createdAt: snippets.createdAt,
            category: {
                id: categories.id,
                name: categories.name
            }
        }).from(snippets).leftJoin(categories, eq(snippets.categoryId, categories.id)).where(eq(snippets.id, id))
        return result ?? null
    }

    async create(title: string, content: string, format: string, categoryId: number): Promise<InsertResult> {
        const [result] = await db.insert(snippets).values({ title, content, format, categoryId })
        return {
            success: result.affectedRows > 0,
            id: result.insertId
        }
    }

    async update(id: number, title: string, content: string, format: string, categoryId: number): Promise<UpdateResult> {
        const [result] = await db.update(snippets).set({ title, content, format, categoryId }).where(eq(snippets.id, id))
        return {
            success: result.affectedRows > 0
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const [result] = await db.delete(snippets).where(eq(snippets.id, id))
        return {
            success: result.affectedRows > 0
        }
    }

    async addTag(snippetId: number, tagId: number): Promise<InsertResult> {
        const [result] = await db.insert(snippetTags).values({ snippetId, tagId })
        return {
            success: result.affectedRows > 0,
            id: result.insertId ?? 0
        }
    }

    async removeTag(snippetId: number, tagId: number): Promise<DeleteResult> {
        const [result] = await db.delete(snippetTags).where(
            and(
                eq(snippetTags.tagId, tagId),
                eq(snippetTags.snippetId, snippetId)
            ))

        return {
            success: result.affectedRows > 0
        }
    }
}