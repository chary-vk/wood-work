import {
  buildGalleryPayload,
  photoUrl,
  type GalleryPayload,
} from '@/lib/galleryUtils'

export type {
  GalleryFolder,
  GalleryItem,
  GalleryPayload,
} from '@/lib/galleryUtils'
export { photoUrl, buildGalleryPayload }

export async function fetchGallery(): Promise<GalleryPayload> {
  const res = await fetch('/api/gallery', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load gallery')
  return res.json() as Promise<GalleryPayload>
}

export async function fetchAdminSession(): Promise<boolean> {
  const res = await fetch('/api/auth/session', { credentials: 'include' })
  if (!res.ok) return false
  const data = (await res.json()) as { admin?: boolean }
  return Boolean(data.admin)
}

export async function loginAdmin(username: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      typeof data.error === 'string' ? data.error : 'Invalid credentials',
    )
  }
}

export async function logoutAdmin() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
}

export async function uploadPhotos(
  files: File[],
  category: string,
  title?: string,
): Promise<void> {
  const form = new FormData()
  form.append('category', category)
  if (title?.trim()) form.append('title', title.trim())
  for (const file of files) form.append('photos', file)

  const res = await fetch('/api/gallery', {
    method: 'POST',
    body: form,
    credentials: 'include',
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Upload failed')
  }
}

export async function deletePhoto(id: string): Promise<void> {
  const res = await fetch(`/api/gallery/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Delete failed')
  }
}

export async function updatePhoto(
  id: string,
  input: { title?: string; category?: string },
): Promise<GalleryPayload> {
  const res = await fetch(`/api/gallery/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Update failed')
  }
  return data as GalleryPayload
}
