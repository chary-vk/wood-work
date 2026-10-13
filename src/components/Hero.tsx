import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { site, telHref, whatsappHref } from '../content/site'
import { useLanguage } from '../i18n/LanguageContext'

export function Hero() {
  const { lang, t } = useLanguage()
  const primaryPhone = site.contacts[0].phone

  return (
    <section id="home" className="overflow-hidden bg-teak-dark">
      <div className="mx-auto flex max-w-6xl flex-col lg:min-h-[420px] lg:flex-row lg:items-stretch">
        <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-10 md:px-6 md:py-12 lg:max-w-[52%] lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-forest/50 px-4 py-1.5 text-sm font-semibold text-gold-light backdrop-blur-sm lg:hidden">
              <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
              {t.hero.teakBadge}
            </span>

            <h1
              className={`mt-5 text-3xl font-semibold leading-tight text-white drop-shadow-sm sm:text-4xl lg:mt-0 lg:text-[2.35rem] lg:leading-tight xl:text-5xl ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
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

        <div className="relative flex shrink-0 flex-col justify-center bg-parchment lg:flex-1">
          <div className="relative w-full overflow-hidden lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-3">
            <img
              src={site.heroBanner}
              alt=""
              width={1200}
              height={675}
              fetchPriority="high"
              decoding="async"
              className="mx-auto block h-auto w-full max-h-[min(52vw,280px)] object-contain object-center sm:max-h-[320px] lg:max-h-none lg:max-w-full lg:object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
