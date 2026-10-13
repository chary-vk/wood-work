import type { CategoryId } from '../content/site'

export type GalleryItem = {
  id: string
  path: string
  category: CategoryId
  title: string
  uploadedAt: string
  year: number
  month: number
  folderKey: string
}

export type GalleryFolder = {
  id: string
  year: number
  month: number
  items: GalleryItem[]
}

export type GalleryPayload = {
  items: GalleryItem[]
  folders: GalleryFolder[]
  years: number[]
  categories: CategoryId[]
}

const CATEGORIES: CategoryId[] = [
  'doorFrames',
  'doors',
  'windows',
  'windowShutters',
  'beds',
  'tables',
]

export function photoUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }
  if (pathOrUrl.startsWith('/')) return pathOrUrl
  return `/gallery/images/${pathOrUrl}`
}

export function buildGalleryPayload(items: GalleryItem[]): GalleryPayload {
  const sorted = [...items].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )

  const folderMap = new Map<string, GalleryFolder>()
  for (const item of sorted) {
    if (!folderMap.has(item.folderKey)) {
      folderMap.set(item.folderKey, {
        id: item.folderKey,
        year: item.year,
        month: item.month,
        items: [],
      })
    }
    folderMap.get(item.folderKey)!.items.push(item)
  }

  const folders = [...folderMap.values()].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })

  return {
    items: sorted,
    folders,
    years: [...new Set(sorted.map((i) => i.year))].sort((a, b) => b - a),
    categories: CATEGORIES,
  }
}

