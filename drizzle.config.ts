import { defineConfig } from 'drizzle-kit'

const url =
  process.env.wood_TURSO_DATABASE_URL ??
  process.env.TURSO_DATABASE_URL ??
  'file:./data/gallery.db'

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url,
    authToken:
      process.env.wood_TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN,
  },
})
