// types/index.ts
import { snippets, categories, tags, snippetTags } from '../lib/schema'

// Types générés par Drizzle depuis ton schema
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert

export type SelectedSnippet = typeof snippets.$inferSelect
// Type avec jointures (ce que tu renvoies au front)
export type Snippet = Omit<SelectedSnippet, 'categoryId'> & {
    category: Category | null
}

export type NewSnippet = typeof snippets.$inferInsert


export type SnippetTag = typeof snippetTags.$inferSelect
export type NewSnippetTag = typeof snippetTags.$inferInsert

// Résultats des opérations DB
export interface InsertResult {
    success: boolean
    id: number
}

export interface UpdateResult {
    success: boolean
}

export interface DeleteResult {
    success: boolean
}