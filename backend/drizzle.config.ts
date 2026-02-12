// drizzle.config.ts (à la racine du projet)
import type { Config } from 'drizzle-kit'

export default {
    schema: './src/lib/schema.ts',
    out: './drizzle',
    dialect: 'mysql',
    dbCredentials: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'snippets',
        port: parseInt(process.env.DB_PORT || '3306')
    },
    verbose: true,
    strict: true
} satisfies Config