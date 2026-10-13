import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '../content/site'
import { useLanguage } from '../i18n/LanguageContext'

const SWIPE_THRESHOLD = 48

export function CraftCarousel() {
  const { lang, t } = useLanguage()
  const slides = site.craftCarousel
  const [index, setIndex] = useState(0)
  const touchStart = useRef<number | null>(null)

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const active = slides[index]
  const caption = t.about.carousel[active.id]

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-2xl bg-teak-dark/5 shadow-xl ring-1 ring-teak/15"
        onTouchStart={(e) => {
          touchStart.current = e.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          if (touchStart.current == null) return
          const end = e.changedTouches[0]?.clientX ?? touchStart.current
          const diff = end - touchStart.current
          if (Math.abs(diff) >= SWIPE_THRESHOLD) go(diff > 0 ? -1 : 1)
          touchStart.current = null
        }}
      >
        <div className="relative aspect-[4/5] w-full sm:aspect-[5/6] md:aspect-[4/5]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={active.src}
              src={active.src}
              alt=""
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center contrast-[1.03] saturate-[1.05]"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              draggable={false}
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-teak-dark/75 via-transparent to-transparent" />
          <p
            className={`absolute bottom-4 left-4 right-14 text-lg font-semibold text-white drop-shadow md:text-xl ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
          >
            {caption}
          </p>
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-teak-dark shadow-md transition hover:bg-white md:inline-flex"
          aria-label={t.about.carouselPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-teak-dark shadow-md transition hover:bg-white md:inline-flex"
          aria-label={t.about.carouselNext}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        className="mt-4 flex justify-center gap-2"
        role="tablist"
        aria-label={t.about.carouselDots}
      >
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${t.about.carousel[slide.id]} — ${i + 1} / ${slides.length}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-forest' : 'w-2.5 bg-teak/30 hover:bg-teak/50'}`}
          />
        ))}
      </div>

      <p className="mt-2 text-center text-xs text-teak/70 md:hidden">
        {t.about.carouselSwipe}
      </p>
    </div>
  )
}
