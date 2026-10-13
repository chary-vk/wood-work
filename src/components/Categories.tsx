'use client'

import { fetchCategories } from '@/api/categories'
import { categoryBlurb, categoryLabel } from '@/lib/category-types'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

type Props = {
  onSelectCategory: (slug: string) => void
}

export function Categories({ onSelectCategory }: Props) {
  const { lang, t } = useLanguage()
  const [categories, setCategories] = useState<
    Awaited<ReturnType<typeof fetchCategories>>
  >([])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const handleEnquire = (slug: string) => {
    onSelectCategory(slug)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="categories" className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2
            className={`text-3xl font-semibold text-teak-dark md:text-4xl ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
          >
            {t.categories.title}
          </h2>
          <p
            className={`mx-auto mt-3 max-w-2xl text-teak ${lang === 'te' ? 'font-telugu' : ''}`}
          >
            {t.categories.subtitle}
          </p>
        </motion.div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <motion.li
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <article className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-teak/10 transition hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.imageUrl ?? '/images/craft/03-doors.jpg'}
                    alt=""
                    className="h-full w-full object-cover contrast-[1.04] saturate-[1.04] transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teak-dark/80 via-transparent to-transparent" />
                  <h3
                    className={`absolute bottom-4 left-4 right-4 text-xl font-semibold text-white ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
                  >
                    {categoryLabel(cat, lang)}
                  </h3>
                </div>
                <div className="p-5">
                  <p
                    className={`text-sm text-teak ${lang === 'te' ? 'font-telugu' : ''}`}
                  >
                    {categoryBlurb(cat, lang)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleEnquire(cat.slug)}
                    className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest transition hover:text-forest-light ${lang === 'te' ? 'font-telugu' : ''}`}
                  >
                    {t.categories.enquire}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
