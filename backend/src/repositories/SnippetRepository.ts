import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { snippets, snippetTags, categories, tags } from "../lib/schema";
import { DeleteResult, InsertResult, Snippet, UpdateResult } from "../types";


export class SnippetRepository {

    /** Retourne tous les snippets avec leur catégorie et leurs tags */
    async findAll(): Promise<Snippet[]> {
        const rows = await db.select({
            id: snippets.id,
            title: snippets.title,
            content: snippets.content,
            format: snippets.format,
            createdAt: snippets.createdAt,
            category: { id: categories.id, name: categories.name },
            tag: { id: tags.id, name: tags.name }
        }).from(snippets)
            .leftJoin(categories, eq(snippets.categoryId, categories.id))
            .leftJoin(snippetTags, eq(snippets.id, snippetTags.snippetId))
            .leftJoin(tags, eq(snippetTags.tagId, tags.id))

        // Regroupement des lignes : 1 ligne par tag → 1 objet par snippet avec tableau de tags
        const snippetMap = new Map<number, Snippet>()
        for (const row of rows) {
            if (!snippetMap.has(row.id)) {
                snippetMap.set(row.id, {
                    id: row.id,
                    title: row.title,
                    content: row.content,
                    format: row.format,
                    createdAt: row.createdAt,
                    category: row.category?.id ? row.category : null,
                    tags: []
                })
            }
            if (row.tag?.id) {
                snippetMap.get(row.id)!.tags.push(row.tag)
            }
        }
        return Array.from(snippetMap.values())
    }

    /** Retourne un snippet par son ID avec sa catégorie et ses tags, ou null s'il n'existe pas */
    async findById(id: number): Promise<Snippet | null> {
        const rows = await db.select({
            id: snippets.id,
            title: snippets.title,
            content: snippets.content,
            format: snippets.format,
            createdAt: snippets.createdAt,
            category: { id: categories.id, name: categories.name },
            tag: { id: tags.id, name: tags.name }
        }).from(snippets)
            .leftJoin(categories, eq(snippets.categoryId, categories.id))
            .leftJoin(snippetTags, eq(snippets.id, snippetTags.snippetId))
            .leftJoin(tags, eq(snippetTags.tagId, tags.id))
            .where(eq(snippets.id, id))

        if (rows.length === 0) return null

        // Même logique de regroupement que findAll, mais sur un seul snippet
        const first = rows[0]
        return {
            id: first.id,
            title: first.title,
            content: first.content,
            format: first.format,
            createdAt: first.createdAt,
            category: first.category?.id ? first.category : null,
            tags: rows.filter(r => r.tag?.id).map(r => r.tag!)
        }
    }

    /** Insère un nouveau snippet et retourne son ID */
    async create(title: string, content: string, format: string, categoryId: number): Promise<InsertResult> {
        const [result] = await db.insert(snippets).values({ title, content, format, categoryId })
        return {
            success: result.affectedRows > 0,
            id: result.insertId
        }
    }

    /** Met à jour un snippet existant */
    async update(id: number, title: string, content: string, format: string, categoryId: number): Promise<UpdateResult> {
        const [result] = await db.update(snippets).set({ title, content, format, categoryId }).where(eq(snippets.id, id))
        return {
            success: result.affectedRows > 0
        }
    }

    /** Supprime un snippet par son ID */
    async delete(id: number): Promise<DeleteResult> {
        const [result] = await db.delete(snippets).where(eq(snippets.id, id))
        return {
            success: result.affectedRows > 0
        }
    }

    /**
     * Associe plusieurs tags à un snippet en une seule requête batch.
     * Si tagIds est vide, aucune requête n'est effectuée.
     */
    async addTags(snippetId: number, tagIds: number[]): Promise<void> {
        if (tagIds.length === 0) return
        await db.insert(snippetTags).values(tagIds.map(tagId => ({ snippetId, tagId })))
    }

    /** Supprime tous les tags associés à un snippet */
    async removeAllTags(snippetId: number): Promise<void> {
        await db.delete(snippetTags).where(eq(snippetTags.snippetId, snippetId))
    }
}
