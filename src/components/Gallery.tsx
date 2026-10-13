'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, ImageIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  fetchGallery,
  photoUrl,
  type GalleryFolder,
  type GalleryItem,
} from '../api/gallery'
import {
  categoryLabel,
  labelForSlug,
  type GalleryCategory,
} from '@/lib/category-types'
import {
  galleryDisplayTitle,
  isUuidLike,
} from '@/lib/galleryUtils'
import { useLanguage } from '../i18n/LanguageContext'
import { GalleryLightbox } from './GalleryLightbox'

function monthLabel(lang: string, year: number, month: number) {
  const d = new Date(year, month - 1, 1)
  return d.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', {
    month: 'long',
    year: 'numeric',
  })
}

function groupFiltered(items: GalleryItem[]): GalleryFolder[] {
  const map = new Map<string, GalleryFolder>()
  for (const item of items) {
    if (!map.has(item.folderKey)) {
      map.set(item.folderKey, {
        id: item.folderKey,
        year: item.year,
        month: item.month,
        items: [],
      })
    }
    map.get(item.folderKey)!.items.push(item)
  }
  return [...map.values()].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })
}

export function Gallery() {
  const { lang, t } = useLanguage()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [years, setYears] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string | 'all'>('all')
  const [year, setYear] = useState<number | 'all'>('all')
  const [month, setMonth] = useState<number | 'all'>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchGallery()
      .then((data) => {
        setItems(data.items)
        setCategories(data.categories)
        setYears(data.years)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (year !== 'all' && item.year !== year) return false
      if (month !== 'all' && item.month !== month) return false
      return true
    })
  }, [items, category, year, month])

  const folders = useMemo(() => groupFiltered(filtered), [filtered])

  const lightboxItems = useMemo(
    () => folders.flatMap((folder) => folder.items),
    [folders],
  )

  const monthOptions = useMemo(() => {
    if (year === 'all') return []
    const months = new Set(
      items.filter((i) => i.year === year).map((i) => i.month),
    )
    return [...months].sort((a, b) => b - a)
  }, [items, year])

  const openLightbox = (itemId: string) => {
    const i = lightboxItems.findIndex((x) => x.id === itemId)
    if (i >= 0) setLightboxIndex(i)
  }

  return (
    <section id="gallery" className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2
            className={`text-3xl font-semibold text-teak-dark md:text-4xl ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
          >
            {t.gallery.title}
          </h2>
          <p
            className={`mx-auto mt-3 max-w-2xl text-teak ${lang === 'te' ? 'font-telugu' : ''}`}
          >
            {t.gallery.subtitle}
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <label className={`text-sm ${lang === 'te' ? 'font-telugu' : ''}`}>
            <span className="mb-1 block font-medium text-teak-dark">
              {t.gallery.filterCategory}
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-teak/20 bg-white px-3 py-2 text-sm text-teak-dark"
            >
              <option value="all">{t.gallery.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {categoryLabel(cat, lang)}
                </option>
              ))}
            </select>
          </label>

          <label className={`text-sm ${lang === 'te' ? 'font-telugu' : ''}`}>
            <span className="mb-1 block font-medium text-teak-dark">
              {t.gallery.filterYear}
            </span>
            <select
              value={year === 'all' ? 'all' : String(year)}
              onChange={(e) => {
                const v = e.target.value
                setYear(v === 'all' ? 'all' : Number(v))
                setMonth('all')
              }}
              className="rounded-xl border border-teak/20 bg-white px-3 py-2 text-sm text-teak-dark"
            >
              <option value="all">{t.gallery.allYears}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          {year !== 'all' ? (
            <label className={`text-sm ${lang === 'te' ? 'font-telugu' : ''}`}>
              <span className="mb-1 block font-medium text-teak-dark">
                {t.gallery.filterMonth}
              </span>
              <select
                value={month === 'all' ? 'all' : String(month)}
                onChange={(e) => {
                  const v = e.target.value
                  setMonth(v === 'all' ? 'all' : Number(v))
                }}
                className="rounded-xl border border-teak/20 bg-white px-3 py-2 text-sm text-teak-dark"
              >
                <option value="all">{t.gallery.allMonths}</option>
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {monthLabel(lang, year, m)}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        {loading ? (
          <p className="mt-12 text-center text-teak">{t.gallery.loading}</p>
        ) : folders.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-3 text-teak/70">
            <ImageIcon className="h-10 w-10" aria-hidden />
            <p className={lang === 'te' ? 'font-telugu' : ''}>
              {t.gallery.empty}
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {folders.map((folder) => (
              <div key={folder.id}>
                <h3
                  className={`mb-4 flex items-center gap-2 text-lg font-semibold text-forest ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
                >
                  <FolderOpen className="h-5 w-5 text-gold" aria-hidden />
                  {monthLabel(lang, folder.year, folder.month)}
                  <span className="text-sm font-normal text-teak/70">
                    ({folder.items.length})
                  </span>
                </h3>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {folder.items.map((item) => {
                    const catLabel = labelForSlug(
                      categories,
                      item.category,
                      lang,
                    )
                    const displayTitle = galleryDisplayTitle(
                      item,
                      categories,
                      lang,
                    )
                    const showCustomTitle =
                      displayTitle !== catLabel &&
                      !isUuidLike(item.title.trim())

                    return (
                      <li
                        key={item.id}
                        className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-teak/10"
                      >
                        <button
                          type="button"
                          onClick={() => openLightbox(item.id)}
                          className="group block w-full cursor-zoom-in text-left"
                          aria-label={`${t.gallery.openPhoto}: ${displayTitle}`}
                        >
                          <div className="flex min-h-[12rem] items-center justify-center bg-parchment-dark p-3 sm:min-h-[14rem]">
                            <img
                              src={photoUrl(item.path)}
                              alt=""
                              className="max-h-64 w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                              loading="lazy"
                            />
                          </div>
                        </button>
                        <div className="p-4">
                          <p
                            className={`font-medium text-teak-dark ${lang === 'te' ? 'font-telugu' : ''}`}
                          >
                            {showCustomTitle ? displayTitle : catLabel}
                          </p>
                          {showCustomTitle ? (
                            <p
                              className={`mt-1 text-xs text-teak ${lang === 'te' ? 'font-telugu' : ''}`}
                            >
                              {catLabel}
                            </p>
                          ) : null}
                          <p className="mt-1 text-xs text-teak/60">
                            {new Date(item.uploadedAt).toLocaleString(
                              lang === 'te' ? 'te-IN' : 'en-IN',
                              {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              },
                            )}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && lightboxItems.length > 0 ? (
          <GalleryLightbox
            items={lightboxItems}
            categories={categories}
            index={lightboxIndex}
            lang={lang}
            labels={{
              close: t.gallery.lightboxClose,
              prev: t.gallery.lightboxPrev,
              next: t.gallery.lightboxNext,
              counter: (current, total) => `${current} / ${total}`,
            }}
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
          />
        ) : null}
      </AnimatePresence>
    </section>
  )
}
