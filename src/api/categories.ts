import type { GalleryCategory } from '@/lib/category-types'

export type { GalleryCategory }

export async function fetchCategories(): Promise<GalleryCategory[]> {
  const res = await fetch('/api/categories', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load categories')
  const data = (await res.json()) as { categories: GalleryCategory[] }
  return data.categories
}
