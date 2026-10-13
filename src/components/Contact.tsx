import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import {
  site,
  telHref,
  whatsappHref,
  type CategoryId,
} from '../content/site'
import { categoryLabel } from '../i18n/translations'
import { useLanguage } from '../i18n/LanguageContext'

type Props = {
  selectedCategory: CategoryId | ''
  onCategoryChange: (id: CategoryId | '') => void
}

export function Contact({ selectedCategory, onCategoryChange }: Props) {
  const { lang, t } = useLanguage()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const categoryText = selectedCategory
      ? categoryLabel(lang, selectedCategory)
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
            className={`mx-auto mt-3 max-w-xl text-teak ${lang === 'te' ? 'font-telugu' : ''}`}
          >
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3
              className={`text-lg font-semibold text-teak-dark ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
            >
              {t.contact.callUs}
            </h3>
            <ul className="mt-4 space-y-4">
              {site.contacts.map((contact) => (
                <li
                  key={contact.phone}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-teak/10"
                >
                  <p className="font-semibold text-teak-dark">{contact.name}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-wide text-forest">
                    {contact.display}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={telHref(contact.phone)}
                      className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-teak-dark transition hover:bg-gold-light"
                    >
                      <Phone className="h-4 w-4" />
                      {t.callNow}
                    </a>
                    <a
                      href={whatsappHref(
                        lang === 'te'
                          ? `నమస్కారం, ${contact.name} గారితో మాట్లాడాలనుకుంటున్నాను.`
                          : `Hello, I would like to speak with ${contact.name}.`,
                        `91${contact.phone}`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-forest/30 px-4 py-2 text-sm font-semibold text-forest transition hover:bg-forest/5"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t.whatsapp}
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 overflow-hidden rounded-2xl shadow-md ring-1 ring-teak/10">
              <iframe
                title={t.contact.mapTitle}
                src={site.mapsEmbedUrl}
                className="h-56 w-full border-0 md:h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={site.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-white px-4 py-3 text-center text-sm font-medium text-forest hover:underline ${lang === 'te' ? 'font-telugu' : ''}`}
              >
                {site.address[lang]} — Google Maps
              </a>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-teak/10 md:p-8"
          >
            <h3
              className={`text-lg font-semibold text-teak-dark ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
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
                type="text"
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
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                onChange={(e) =>
                  onCategoryChange((e.target.value || '') as CategoryId | '')
                }
                className={`mt-1 w-full rounded-xl border border-teak/20 bg-parchment/50 px-4 py-3 text-teak-dark outline-none ring-forest focus:ring-2 ${lang === 'te' ? 'font-telugu' : ''}`}
              >
                <option value="">{t.contact.form.selectCategory}</option>
                {site.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t.categories.items[c.id].title}
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
