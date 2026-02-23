// types/index.ts
export type {
    Category,
    NewCategory,
    Tag,
    NewTag,
    Snippet,
    NewSnippet,
    NewSnippetWithTags,
    SnippetTag,
    NewSnippetTag,
} from '../../../shared/types'

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