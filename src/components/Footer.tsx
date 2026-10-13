import type { ReactNode } from 'react'
import { site } from '../content/site'
import {
  IconFacebook,
  IconInstagram,
  IconWhatsApp,
  IconYoutube,
} from './SocialIcons'
import { useVisitorCount } from '../hooks/useVisitorCount'
import { useLanguage } from '../i18n/LanguageContext'

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  const isPlaceholder = href === '#'
  return (
    <a
      href={href}
      aria-label={label}
      target={isPlaceholder ? undefined : '_blank'}
      rel={isPlaceholder ? undefined : 'noopener noreferrer'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-parchment transition hover:border-gold hover:text-gold-light"
      onClick={
        isPlaceholder
          ? (e) => {
              e.preventDefault()
            }
          : undefined
      }
      title={isPlaceholder ? `${label} (link coming soon)` : label}
    >
      {children}
    </a>
  )
}

export function Footer() {
  const { lang, t } = useLanguage()
  const visitorCount = useVisitorCount()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-teak/10 bg-teak-dark py-12 text-parchment">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p
              className={`text-lg font-semibold text-white ${lang === 'te' ? 'font-telugu' : 'font-display'}`}
            >
              {site.name[lang]}
            </p>
            <p
              className={`mt-2 text-sm text-parchment/80 ${lang === 'te' ? 'font-telugu' : 'italic'}`}
            >
              {t.footer.tagline}
            </p>
            <p
              className={`mt-3 text-sm text-parchment/70 ${lang === 'te' ? 'font-telugu' : ''}`}
            >
              {site.address[lang]}
            </p>
            <p className="mt-1 text-sm text-gold-light/90">{t.footer.hours}</p>
          </div>

          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-wider text-gold-light ${lang === 'te' ? 'font-telugu normal-case' : ''}`}
            >
              {t.footer.followUs}
            </p>
            <div className="mt-4 flex gap-3">
              <SocialLink href={site.social.whatsapp} label="WhatsApp">
                <IconWhatsApp className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={site.social.facebook} label="Facebook">
                <IconFacebook className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={site.social.instagram} label="Instagram">
                <IconInstagram className="h-5 w-5" />
              </SocialLink>
              <SocialLink href={site.social.youtube} label="YouTube">
                <IconYoutube className="h-5 w-5" />
              </SocialLink>
            </div>
          </div>
        </div>

        <div
          className={`mt-10 space-y-3 border-t border-white/10 pt-6 text-center text-xs text-parchment/60 ${lang === 'te' ? 'font-telugu' : ''}`}
        >
          <p>
            © {year} {site.name.en}. {t.footer.rights}
          </p>
          {visitorCount != null ? (
            <p className="text-parchment/70">
              {t.footer.visitors}:{' '}
              <span className="font-semibold tabular-nums text-gold-light">
                {visitorCount.toLocaleString('en-IN')}
              </span>
            </p>
          ) : null}
          <p>
            {t.footer.developedBy}{' '}
            <a
              href={site.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold-light/90 underline-offset-2 transition hover:text-gold-light hover:underline"
            >
              {site.developer.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
