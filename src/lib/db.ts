import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import * as schema from './schema'
import { tursoAuthToken, tursoDatabaseUrl } from './turso-env'

function resolveDatabaseUrl(): string {
  const turso = tursoDatabaseUrl()
  if (turso) return turso

  // `next build` must not require a writable local SQLite file (e.g. on Vercel).
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return ':memory:'
  }

  const dir = path.join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return `file:${path.join(dir, 'gallery.db')}`
}

const client = createClient({
  url: resolveDatabaseUrl(),
  authToken: tursoAuthToken(),
})

export const db = drizzle(client, { schema })
