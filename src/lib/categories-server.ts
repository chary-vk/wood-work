import { asc, eq, sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type { GalleryCategory } from './category-types'
import { ensureDb } from './ensure-db'
import { db } from './db'
import { galleryCategories, galleryPhotos } from './schema'

function rowToCategory(row: typeof galleryCategories.$inferSelect): GalleryCategory {
  return {
    id: row.id,
    slug: row.slug,
    labelEn: row.labelEn,
    labelTe: row.labelTe,
    blurbEn: row.blurbEn,
    blurbTe: row.blurbTe,
    imageUrl: row.imageUrl,
    sortOrder: row.sortOrder,
  }
}

export async function listCategories(): Promise<GalleryCategory[]> {
  await ensureDb()
  const rows = await db
    .select()
    .from(galleryCategories)
    .orderBy(asc(galleryCategories.sortOrder), asc(galleryCategories.slug))
  return rows.map(rowToCategory)
}

export async function categorySlugExists(slug: string) {
  await ensureDb()
  const rows = await db
    .select({ slug: galleryCategories.slug })
    .from(galleryCategories)
    .where(eq(galleryCategories.slug, slug))
    .limit(1)
  return rows.length > 0
}

const SLUG_RE = /^[a-z][a-z0-9_-]{0,47}$/

export function normalizeSlug(raw: string) {
  return raw.trim().replace(/\s+/g, '-').toLowerCase()
}

export function validateSlug(slug: string) {
  if (!SLUG_RE.test(slug)) {
    throw new Error(
      'Slug must start with a letter and use only lowercase letters, numbers, - or _',
    )
  }
}

export async function createCategory(input: {
  slug: string
  labelEn: string
  labelTe: string
  blurbEn?: string
  blurbTe?: string
  imageUrl?: string | null
  sortOrder?: number
}) {
  await ensureDb()
  const slug = normalizeSlug(input.slug)
  validateSlug(slug)
  if (await categorySlugExists(slug)) throw new Error('Category slug already exists')

  const rows = await db.select({ n: sql<number>`count(*)` }).from(galleryCategories)
  const sortOrder = input.sortOrder ?? Number(rows[0]?.n ?? 0)

  await db.insert(galleryCategories).values({
    id: randomUUID(),
    slug,
    labelEn: input.labelEn.trim(),
    labelTe: input.labelTe.trim(),
    blurbEn: input.blurbEn?.trim() ?? '',
    blurbTe: input.blurbTe?.trim() ?? '',
    imageUrl: input.imageUrl?.trim() || null,
    sortOrder,
  })

  return listCategories()
}

export async function updateCategory(
  id: string,
  input: Partial<{
    labelEn: string
    labelTe: string
    blurbEn: string
    blurbTe: string
    imageUrl: string | null
    sortOrder: number
  }>,
) {
  await ensureDb()
  const patch: Record<string, string | number | null> = {}
  if (input.labelEn !== undefined) patch.labelEn = input.labelEn.trim()
  if (input.labelTe !== undefined) patch.labelTe = input.labelTe.trim()
  if (input.blurbEn !== undefined) patch.blurbEn = input.blurbEn.trim()
  if (input.blurbTe !== undefined) patch.blurbTe = input.blurbTe.trim()
  if (input.imageUrl !== undefined) {
    patch.imageUrl = input.imageUrl?.trim() || null
  }
  if (input.sortOrder !== undefined) patch.sortOrder = input.sortOrder

  if (Object.keys(patch).length === 0) return listCategories()

  await db.update(galleryCategories).set(patch).where(eq(galleryCategories.id, id))
  return listCategories()
}

export async function deleteCategory(id: string) {
  await ensureDb()
  const row = await db
    .select()
    .from(galleryCategories)
    .where(eq(galleryCategories.id, id))
    .limit(1)
  const cat = row[0]
  if (!cat) throw new Error('Category not found')

  const photos = await db
    .select({ n: sql<number>`count(*)` })
    .from(galleryPhotos)
    .where(eq(galleryPhotos.category, cat.slug))
  if (Number(photos[0]?.n ?? 0) > 0) {
    throw new Error('Remove or reassign gallery photos in this category first')
  }

  await db.delete(galleryCategories).where(eq(galleryCategories.id, id))
  return listCategories()
}
