import { site } from '../content/site'
import { IconWhatsApp } from './SocialIcons'
import { useLanguage } from '../i18n/LanguageContext'

export function WhatsAppFloat() {
  const { lang, t } = useLanguage()

  return (
    <a
      href={site.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl md:bottom-8 md:right-8"
      aria-label={t.whatsapp}
    >
      <IconWhatsApp className="h-7 w-7" aria-hidden />
      <span className="sr-only">
        {lang === 'te' ? 'వాట్సాప్‌లో చాట్ చేయండి' : 'Chat on WhatsApp'}
      </span>
    </a>
  )
}
