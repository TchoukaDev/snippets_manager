import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { tags } from "../lib/schema";
import type { DeleteResult, InsertResult, Tag, UpdateResult } from "../types";

export class TagRepository {
    async findAll(): Promise<Tag[]> {
        return db.select().from(tags)
    }

    async findById(tagId: number): Promise<Tag | null> {
        const [result] = await db.select().from(tags).where(eq(tags.id, tagId))
        return result ?? null
    }

    async create(name: string): Promise<InsertResult> {
        const [result] = await db.insert(tags).values({ name })
        return {
            success: result.affectedRows > 0,
            id: result.insertId
        }
    }

    async update(tagId: number, name: string): Promise<UpdateResult> {
        const [result] = await db.update(tags).set({ name }).where(eq(tags.id, tagId))
        return {
            success: result.affectedRows > 0
        }
    }

    async delete(tagId: number): Promise<DeleteResult> {
        const [result] = await db.delete(tags).where(eq(tags.id, tagId))
        return { success: result.affectedRows > 0 }
    }
}