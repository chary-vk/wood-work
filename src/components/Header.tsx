import { Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { site, telHref } from '../content/site'
import { useLanguage } from '../i18n/LanguageContext'

const navIds = [
  { id: 'home', href: '#home' },
  { id: 'categories', href: '#categories' },
  { id: 'gallery', href: '#gallery' },
  { id: 'about', href: '#about' },
  { id: 'contact', href: '#contact' },
] as const

export function Header() {
  const { lang, setLang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const primaryPhone = site.contacts[0].phone

  return (
    <header className="sticky top-0 z-50 border-b border-teak/10 bg-parchment/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <a
          href="#home"
          className={`min-w-0 font-semibold leading-tight text-teak-dark ${lang === 'te' ? 'font-telugu text-sm md:text-base' : 'font-display text-base md:text-lg'}`}
        >
          {site.name[lang]}
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navIds.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`text-sm font-medium text-teak transition hover:text-forest ${lang === 'te' ? 'font-telugu' : ''}`}
            >
              {t.nav[item.id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div
            className="flex rounded-full border border-teak/20 bg-white/60 p-0.5 text-xs font-semibold"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`rounded-full px-2.5 py-1 transition ${lang === 'en' ? 'bg-forest text-white' : 'text-teak hover:text-teak-dark'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('te')}
              className={`rounded-full px-2.5 py-1 font-telugu transition ${lang === 'te' ? 'bg-forest text-white' : 'text-teak hover:text-teak-dark'}`}
            >
              తె
            </button>
          </div>

          <a
            href={telHref(primaryPhone)}
            className="hidden items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-teak-dark shadow-sm transition hover:bg-gold-light md:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {t.callNow}
          </a>

          <button
            type="button"
            className="inline-flex rounded-lg p-2 text-teak-dark md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-teak/10 bg-parchment px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {navIds.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`block text-base font-medium text-teak-dark ${lang === 'te' ? 'font-telugu' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {t.nav[item.id]}
                </a>
              </li>
            ))}
            <li>
              <a
                href={telHref(primaryPhone)}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 font-semibold text-teak-dark"
                onClick={() => setOpen(false)}
              >
                <Phone className="h-4 w-4" />
                {t.callNow}
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
