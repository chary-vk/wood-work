import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { site, telHref, whatsappHref } from '../content/site'
import { useLanguage } from '../i18n/LanguageContext'

export function Hero() {
  const { lang, t } = useLanguage()
  const primaryPhone = site.contacts[0].phone

  return (
    <section id="home" className="relative overflow-hidden bg-teak-dark">
      <img
        src={site.heroImage}
        alt=""
        width={736}
        height={1312}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[62%_22%] sm:object-[58%_20%] md:object-[center_25%]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-teak-dark/95 via-teak-dark/78 to-teak-dark/30 md:via-teak-dark/68 md:to-teak-dark/15"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-teak-dark/35 via-transparent to-teak-dark/55"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-forest/50 px-4 py-1.5 text-sm font-semibold text-gold-light backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
            {t.hero.teakBadge}
          </span>

          <h1
            className={`mt-5 text-3xl font-semibold leading-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
          >
            {site.name[lang]}
          </h1>

          <p
            className={`mt-3 text-base text-parchment sm:text-lg md:text-xl ${lang === 'te' ? 'font-telugu' : 'font-display italic'}`}
          >
            {t.hero.tagline}
          </p>
          <p
            className={`mt-2 max-w-xl text-sm text-parchment/90 sm:text-base md:text-lg ${lang === 'te' ? 'font-telugu' : ''}`}
          >
            {t.hero.promise}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
            <a
              href={telHref(primaryPhone)}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-base font-semibold text-teak-dark shadow-lg transition hover:bg-gold-light"
            >
              <Phone className="h-5 w-5" aria-hidden />
              {t.callNow}
            </a>
            <a
              href={whatsappHref(
                lang === 'te'
                  ? 'నమస్కారం, మీ website నుంచి సంప్రదిస్తున్నాను.'
                  : 'Hello, I am contacting you from your website.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              {t.whatsapp}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
