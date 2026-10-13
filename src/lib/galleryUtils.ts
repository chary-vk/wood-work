import type { GalleryCategory } from './category-types'
import { labelForSlug } from './category-types'
import type { Lang } from '@/i18n/translations'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuidLike(value: string) {
  return UUID_RE.test(value.trim())
}

/** Human-readable caption — never show raw photo ids as titles. */
export function galleryDisplayTitle(
  item: GalleryItem,
  categories: GalleryCategory[],
  lang: Lang,
) {
  const raw = item.title.trim()
  if (raw && !isUuidLike(raw)) return raw
  const fromPath = filenameStem(item.path)
  if (fromPath && !isUuidLike(fromPath) && !/^\d{10,}-/.test(fromPath)) {
    return fromPath.replace(/[-_]+/g, ' ')
  }
  return labelForSlug(categories, item.category, lang)
}

function filenameStem(pathOrUrl: string) {
  const segment = pathOrUrl.split('/').pop() ?? ''
  return segment.replace(/\.[^.]+$/, '').replace(/^\d+-/, '')
}

export type GalleryItem = {
  id: string
  path: string
  category: string
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
  categories: GalleryCategory[]
}

export function photoUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }
  if (pathOrUrl.startsWith('/')) return pathOrUrl
  return `/gallery/images/${pathOrUrl}`
}

export function buildGalleryPayload(
  items: GalleryItem[],
  categories: GalleryCategory[],
): GalleryPayload {
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
    categories,
  }
}
