'use client'

import { fetchCategories } from '@/api/categories'
import { categoryLabel } from '@/lib/category-types'
import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { site, telHref, whatsappHref } from '../content/site'
import { useLanguage } from '../i18n/LanguageContext'

type Props = {
  selectedCategory: string
  onCategoryChange: (slug: string) => void
}

export function Contact({ selectedCategory, onCategoryChange }: Props) {
  const { lang, t } = useLanguage()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [categories, setCategories] = useState<
    Awaited<ReturnType<typeof fetchCategories>>
  >([])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const cat = categories.find((c) => c.slug === selectedCategory)
    const categoryText = cat
      ? categoryLabel(cat, lang)
      : t.contact.form.selectCategory
    const body = t.whatsappPrefill({
      name: name || '—',
      phone: phone || '—',
      category: categoryText,
      message: message || '—',
    })
    window.open(whatsappHref(body), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contact" className="bg-parchment py-16 md:py-24">
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
            {t.contact.title}
          </h2>
          <p
            className={`mx-auto mt-3 max-w-2xl text-teak ${lang === 'te' ? 'font-telugu' : ''}`}
          >
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3
              className={`text-xl font-semibold text-teak-dark ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
            >
              {t.contact.callUs}
            </h3>
            <ul className="space-y-4">
              {site.contacts.map((c) => (
                <li key={c.phone}>
                  <a
                    href={telHref(c.phone)}
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-md ring-1 ring-teak/10 transition hover:ring-teak/25"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest">
                      <Phone className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-medium text-teak-dark">
                        {c.name}
                      </span>
                      <span className="text-teak">{c.display}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="overflow-hidden rounded-2xl ring-1 ring-teak/10">
              <iframe
                title={t.contact.mapTitle}
                src={site.mapsEmbedUrl}
                className="h-56 w-full border-0 md:h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-teak/10 md:p-8"
          >
            <h3
              className={`text-xl font-semibold text-teak-dark ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
            >
              {t.contact.sendEnquiry}
            </h3>

            <label className="mt-6 block">
              <span
                className={`text-sm font-medium text-teak ${lang === 'te' ? 'font-telugu' : ''}`}
              >
                {t.contact.form.name}
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-teak/20 bg-parchment/50 px-4 py-3 text-teak-dark outline-none ring-forest focus:ring-2"
                autoComplete="name"
              />
            </label>

            <label className="mt-4 block">
              <span
                className={`text-sm font-medium text-teak ${lang === 'te' ? 'font-telugu' : ''}`}
              >
                {t.contact.form.phone}
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                className="mt-1 w-full rounded-xl border border-teak/20 bg-parchment/50 px-4 py-3 text-teak-dark outline-none ring-forest focus:ring-2"
                autoComplete="tel"
              />
            </label>

            <label className="mt-4 block">
              <span
                className={`text-sm font-medium text-teak ${lang === 'te' ? 'font-telugu' : ''}`}
              >
                {t.contact.form.category}
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value || '')}
                className={`mt-1 w-full rounded-xl border border-teak/20 bg-parchment/50 px-4 py-3 text-teak-dark outline-none ring-forest focus:ring-2 ${lang === 'te' ? 'font-telugu' : ''}`}
              >
                <option value="">{t.contact.form.selectCategory}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {categoryLabel(c, lang)}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span
                className={`text-sm font-medium text-teak ${lang === 'te' ? 'font-telugu' : ''}`}
              >
                {t.contact.form.message}
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={`mt-1 w-full resize-y rounded-xl border border-teak/20 bg-parchment/50 px-4 py-3 text-teak-dark outline-none ring-forest focus:ring-2 ${lang === 'te' ? 'font-telugu' : ''}`}
              />
            </label>

            <button
              type="submit"
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-forest py-3.5 text-base font-semibold text-white transition hover:bg-forest-light ${lang === 'te' ? 'font-telugu' : ''}`}
            >
              <MessageCircle className="h-5 w-5" />
              {t.contact.form.submit}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
