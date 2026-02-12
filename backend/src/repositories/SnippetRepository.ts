import { and, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { snippets, snippetTags } from "../lib/schema";
import { DeleteResult, InsertResult, Snippet, UpdateResult } from "../types";


export class SnippetRepository {
    async findAll(): Promise<Snippet[]> { return db.select().from(snippets) }

    async findById(id: number) {
        const [result] = await db.select().from(snippets).where(eq(snippets.id, id))
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