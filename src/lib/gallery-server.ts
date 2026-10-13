import { desc, eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { put } from '@vercel/blob'
import { categorySlugExists, listCategories } from './categories-server'
import { ensureDb } from './ensure-db'
import { db } from './db'
import { galleryPhotos } from './schema'
import { buildGalleryPayload, type GalleryItem } from './galleryUtils'

function rowToItem(row: {
  id: string
  category: string
  title: string
  imageUrl: string
  uploadedAt: string
}): GalleryItem {
  const d = new Date(row.uploadedAt)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  return {
    id: row.id,
    path: row.imageUrl,
    category: row.category,
    title: row.title,
    uploadedAt: row.uploadedAt,
    year,
    month,
    folderKey: `${year}-${String(month).padStart(2, '0')}`,
  }
}

export async function listGalleryPayload() {
  await ensureDb()
  const [rows, categories] = await Promise.all([
    db.select().from(galleryPhotos).orderBy(desc(galleryPhotos.uploadedAt)),
    listCategories(),
  ])
  return buildGalleryPayload(rows.map(rowToItem), categories)
}

async function storeImage(file: File): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const key = `gallery/${Date.now()}-${safe}`

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, file, { access: 'public', addRandomSuffix: false })
    return blob.url
  }

  const buf = Buffer.from(await file.arrayBuffer())
  const filename = `${Date.now()}-${safe}`
  const dir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, filename), buf)
  return `/uploads/gallery/${filename}`
}

export async function addGalleryPhotos(
  files: File[],
  category: string,
  title?: string,
) {
  if (!(await categorySlugExists(category.trim()))) {
    throw new Error('Invalid category')
  }
  const uploadedAt = new Date().toISOString()

  for (const file of files) {
    const imageUrl = await storeImage(file)
    await db.insert(galleryPhotos).values({
      id: randomUUID(),
      category,
      title: title?.trim() || file.name.replace(/\.[^.]+$/, ''),
      imageUrl,
      uploadedAt,
    })
  }

  return listGalleryPayload()
}

export async function deleteGalleryPhoto(id: string) {
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id))
}
