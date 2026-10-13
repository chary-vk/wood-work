import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { CraftCarousel } from './CraftCarousel'
import { useLanguage } from '../i18n/LanguageContext'

export function About() {
  const { lang, t } = useLanguage()

  return (
    <section id="about" className="bg-parchment-dark py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center md:gap-14 md:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="relative"
        >
          <CraftCarousel />
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-forest/90 px-3 py-1.5 text-xs font-semibold text-gold-light shadow-lg backdrop-blur-sm sm:text-sm">
            <Leaf className="h-4 w-4" aria-hidden />
            {t.about.teakHighlight}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <h2
            className={`text-3xl font-semibold text-teak-dark md:text-4xl ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
          >
            {t.about.title}
          </h2>
          <p
            className={`mt-5 leading-relaxed text-teak ${lang === 'te' ? 'font-telugu text-base' : ''}`}
          >
            {t.about.p1}
          </p>
          <p
            className={`mt-4 leading-relaxed text-teak ${lang === 'te' ? 'font-telugu text-base' : ''}`}
          >
            {t.about.p2}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
