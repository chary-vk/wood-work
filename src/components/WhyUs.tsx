import { motion } from 'framer-motion'
import { Hammer, Palette, Ruler, TreeDeciduous } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const icons = [TreeDeciduous, Hammer, Palette, Ruler]

export function WhyUs() {
  const { lang, t } = useLanguage()

  return (
    <section className="bg-forest py-16 text-parchment md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center text-3xl font-semibold md:text-4xl ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
        >
          {t.whyUs.title}
        </motion.h2>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.whyUs.items.map((item, i) => {
            const Icon = icons[i] ?? TreeDeciduous
            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 inline-flex rounded-xl bg-gold/20 p-3 text-gold-light">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3
                  className={`text-lg font-semibold text-white ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
                >
                  {item.title}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed text-parchment/85 ${lang === 'te' ? 'font-telugu' : ''}`}
                >
                  {item.text}
                </p>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
