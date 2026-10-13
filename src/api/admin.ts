import type { GalleryCategory } from '@/lib/category-types'

export type AdminUser = {
  id: string
  username: string
  createdAt: string
}

async function parseError(res: Response) {
  const data = await res.json().catch(() => ({}))
  throw new Error(typeof data.error === 'string' ? data.error : 'Request failed')
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const res = await fetch('/api/admin/users', { credentials: 'include' })
  if (!res.ok) await parseError(res)
  const data = (await res.json()) as { users: AdminUser[] }
  return data.users
}

export async function createAdminUser(username: string, password: string) {
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) await parseError(res)
  const data = (await res.json()) as { users: AdminUser[] }
  return data.users
}

export async function deleteAdminUser(id: string) {
  const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) await parseError(res)
  const data = (await res.json()) as { users: AdminUser[] }
  return data.users
}

export async function resetAdminPassword(id: string, password: string) {
  const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) await parseError(res)
}

export async function fetchAdminCategories(): Promise<GalleryCategory[]> {
  const res = await fetch('/api/admin/categories', { credentials: 'include' })
  if (!res.ok) await parseError(res)
  const data = (await res.json()) as { categories: GalleryCategory[] }
  return data.categories
}

export async function createGalleryCategory(input: {
  slug: string
  labelEn: string
  labelTe: string
  blurbEn?: string
  blurbTe?: string
  imageUrl?: string | null
}) {
  const res = await fetch('/api/admin/categories', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) await parseError(res)
  const data = (await res.json()) as { categories: GalleryCategory[] }
  return data.categories
}

export async function updateGalleryCategory(
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
  const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) await parseError(res)
  const data = (await res.json()) as { categories: GalleryCategory[] }
  return data.categories
}

export async function deleteGalleryCategory(id: string) {
  const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) await parseError(res)
  const data = (await res.json()) as { categories: GalleryCategory[] }
  return data.categories
}
