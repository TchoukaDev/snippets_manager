export type Category = {
    id: number
    name: string
}
export type NewCategory = {
    name: string
}

export type Tag = {
    id: number
    name: string
}
export type NewTag = {
    name: string
}

export type Snippet = {
    id: number
    title: string
    format: string
    content: string
    createdAt: Date | string | null
    category: Category | null
    tags: Tag[]
}
export type NewSnippet = {
    id?: number | null | undefined
    title: string
    format: string
    content: string
    categoryId?: number | null
}
export type NewSnippetWithTags = NewSnippet & {
    tagIds: number[]
}

export type SnippetTag = {
    snippetId: number
    tagId: number
}
export type NewSnippetTag = {
    snippetId: number
    tagId: number
}