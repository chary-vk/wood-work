import type { Lang } from '@/i18n/translations'

export type GalleryCategory = {
  id: string
  slug: string
  labelEn: string
  labelTe: string
  blurbEn: string
  blurbTe: string
  imageUrl: string | null
  sortOrder: number
}

export function categoryLabel(cat: GalleryCategory, lang: Lang) {
  return lang === 'te' ? cat.labelTe : cat.labelEn
}

export function categoryBlurb(cat: GalleryCategory, lang: Lang) {
  return lang === 'te' ? cat.blurbTe : cat.blurbEn
}
