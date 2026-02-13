import { relations } from "drizzle-orm";
import { index, int, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";



// Tables
export const snippets = mysqlTable("snippets", {
    id: int('id').primaryKey().autoincrement(),
    title: varchar('title', { length: 255 }).unique().notNull(),
    format: varchar('format', { length: 20 }).notNull(),
    content: text('content').notNull(),
    categoryId: int('category_id').references(() => categories.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow()
}, (table) => ({ formatIndex: index('format_index').on(table.format) }))

export const categories = mysqlTable("category", {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 50 }).unique().notNull(),
})

export const tags = mysqlTable("tags", {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 50 }).unique().notNull()
})

export const snippetTags = mysqlTable("snippet_tags", {
    snippetId: int('snippet_id').references(() => snippets.id, { onDelete: "cascade" }).notNull(),
    tagId: int('tag_id').references(() => tags.id, { onDelete: "cascade" }).notNull()
}, (table) => ({ pk: primaryKey({ columns: [table.snippetId, table.tagId] }) }))



// Relations

// "Une catégorie a PLUSIEURS snippets"
export const categoriesRelations = relations(categories, ({ many }) => ({ snippets: many(snippets) }))


// "Un snippet a UNE catégorie"
export const snippetsRelations = relations(snippets, ({ one, many }) => ({
    category: one(categories, {
        fields: [snippets.categoryId], // ← Ma clé étrangère
        references: [categories.id] // ← Pointe vers cet id
    }), snippetTags: many(snippetTags)
}))

export const tagsRelation = relations(tags, ({ many }) => ({
    snippetTags: many(snippetTags)
}))

export const snippetTagsRelation = relations(snippetTags, ({ one }) => ({
    snippet: one(snippets, {
        fields: [snippetTags.snippetId],
        references: [snippets.id]
    }),
    tags: one(tags, {
        fields: [snippetTags.tagId],
        references: [tags.id]
    })
}))

