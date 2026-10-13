import { eq, sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { ensureDb } from './ensure-db'
import { hashPassword, verifyPassword } from './password'
import { db } from './db'
import { adminUsers } from './schema'

export type AdminUserPublic = {
  id: string
  username: string
  createdAt: string
}

export async function listAdminUsers(): Promise<AdminUserPublic[]> {
  await ensureDb()
  const rows = await db
    .select({
      id: adminUsers.id,
      username: adminUsers.username,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
  return rows
}

export async function authenticateAdmin(username: string, password: string) {
  await ensureDb()
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username.trim()))
    .limit(1)
  const user = rows[0]
  if (!user) return null
  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return null
  return { id: user.id, username: user.username }
}

export async function createAdminUser(username: string, password: string) {
  await ensureDb()
  const name = username.trim()
  if (name.length < 2) throw new Error('Username is too short')
  if (password.length < 8) throw new Error('Password must be at least 8 characters')

  const passwordHash = await hashPassword(password)
  try {
    await db.insert(adminUsers).values({
      id: randomUUID(),
      username: name,
      passwordHash,
      createdAt: new Date().toISOString(),
    })
  } catch {
    throw new Error('Username already exists')
  }
  return listAdminUsers()
}

export async function deleteAdminUser(id: string) {
  await ensureDb()
  const count = await db.select({ n: sql<number>`count(*)` }).from(adminUsers)
  if (Number(count[0]?.n ?? 0) <= 1) {
    throw new Error('Cannot delete the last admin user')
  }
  await db.delete(adminUsers).where(eq(adminUsers.id, id))
  return listAdminUsers()
}

export async function updateAdminPassword(id: string, password: string) {
  await ensureDb()
  if (password.length < 8) throw new Error('Password must be at least 8 characters')
  const passwordHash = await hashPassword(password)
  await db
    .update(adminUsers)
    .set({ passwordHash })
    .where(eq(adminUsers.id, id))
}
