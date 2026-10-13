'use client'

import { photoUrl, galleryDisplayTitle, type GalleryItem } from '@/lib/galleryUtils'
import type { GalleryCategory } from '@/lib/category-types'
import { labelForSlug } from '@/lib/category-types'
import type { Lang } from '@/i18n/translations'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'

type Props = {
  items: GalleryItem[]
  categories: GalleryCategory[]
  index: number
  lang: Lang
  labels: {
    close: string
    prev: string
    next: string
    counter: (current: number, total: number) => string
  }
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function GalleryLightbox({
  items,
  categories,
  index,
  lang,
  labels,
  onClose,
  onIndexChange,
}: Props) {
  const touchStart = useRef<number | null>(null)
  const wheelLock = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const go = useCallback(
    (delta: number) => {
      if (items.length === 0) return
      onIndexChange((index + delta + items.length) % items.length)
    },
    [index, items.length, onIndexChange],
  )

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (wheelLock.current) return
      wheelLock.current = true
      go(e.deltaY > 0 ? 1 : -1)
      window.setTimeout(() => {
        wheelLock.current = false
      }, 280)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [go])

  const item = items[index]
  if (!item) return null

  const caption = galleryDisplayTitle(item, categories, lang)
  const category = labelForSlug(categories, item.category, lang)

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={caption}
      className="fixed inset-0 z-[100] flex flex-col bg-teak-dark/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 text-parchment">
        <p className="text-sm font-medium tabular-nums">
          {labels.counter(index + 1, items.length)}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="rounded-full p-2 text-parchment transition hover:bg-white/10"
          aria-label={labels.close}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 md:px-12"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStart.current = e.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          if (touchStart.current == null) return
          const end = e.changedTouches[0]?.clientX ?? touchStart.current
          const diff = end - touchStart.current
          if (Math.abs(diff) >= 48) go(diff > 0 ? -1 : 1)
          touchStart.current = null
        }}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/25 md:inline-flex"
          aria-label={labels.prev}
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={item.id}
            src={photoUrl(item.path)}
            alt={caption}
            className="max-h-[min(78vh,900px)] max-w-full object-contain"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            draggable={false}
          />
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/25 md:inline-flex"
          aria-label={labels.next}
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      <div
        className="shrink-0 border-t border-white/10 px-4 py-4 text-center text-parchment"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className={`text-lg font-semibold ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
        >
          {caption}
        </p>
        <p className={`mt-1 text-sm text-parchment/80 ${lang === 'te' ? 'font-telugu' : ''}`}>
          {category}
        </p>
        <p className="mt-2 text-xs text-parchment/60 md:hidden">
          Swipe or scroll to browse · Tap outside to close
        </p>
      </div>
    </motion.div>
  )
}
