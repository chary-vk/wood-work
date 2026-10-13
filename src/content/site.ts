export type CategoryId =
  | 'doorFrames'
  | 'doors'
  | 'windows'
  | 'windowShutters'
  | 'beds'
  | 'tables'

export type CraftSlideId =
  | 'mainDoor'
  | 'doorFrames'
  | 'doors'
  | 'windows'
  | 'windowShutters'
  | 'beds'
  | 'tables'

export const site = {
  name: {
    en: 'Shankarayya Wooden Furniture Works',
    te: 'శంకరయ్య వుడెన్ ఫర్నిచర్ వర్క్స్',
  },
  address: {
    en: 'Jaligama Bypass Road, Gajwel',
    te: 'జాలిగామ బైపాస్ రోడ్, గజ్వెల్',
  },
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=Jaligama+Bypass+Road,+Gajwel,+Telangana&z=14&output=embed',
  mapsLink: 'https://maps.google.com/?q=Jaligama+Bypass+Road+Gajwel',
  contacts: [
    {
      name: 'Gadiyaram Swami Chari',
      phone: '9100110999',
      display: '9100 110 999',
    },
    {
      name: 'Bhanu Prasad',
      phone: '9866008616',
      display: '9866 00 8616',
    },
  ],
  whatsappPrimary: '919100110999',
  social: {
    whatsapp: 'https://wa.me/919100110999',
    facebook: '#',
    instagram: '#',
    youtube: '#',
  },
  craftCarousel: [
    { id: 'mainDoor' as CraftSlideId, src: '/images/craft/01-main-door.jpg' },
    {
      id: 'doorFrames' as CraftSlideId,
      src: '/images/craft/02-door-frames.jpg',
    },
    { id: 'doors' as CraftSlideId, src: '/images/craft/03-doors.jpg' },
    { id: 'windows' as CraftSlideId, src: '/images/craft/04-windows.jpg' },
    {
      id: 'windowShutters' as CraftSlideId,
      src: '/images/craft/05-window-shutters.jpg',
    },
    { id: 'beds' as CraftSlideId, src: '/images/craft/06-beds.jpg' },
    { id: 'tables' as CraftSlideId, src: '/images/craft/07-tables.jpg' },
  ],
  categories: [
    {
      id: 'doorFrames' as CategoryId,
      image: '/images/craft/02-door-frames.jpg',
    },
    {
      id: 'doors' as CategoryId,
      image: '/images/craft/03-doors.jpg',
    },
    {
      id: 'windows' as CategoryId,
      image: '/images/craft/04-windows.jpg',
    },
    {
      id: 'windowShutters' as CategoryId,
      image: '/images/craft/05-window-shutters.jpg',
    },
    {
      id: 'beds' as CategoryId,
      image: '/images/craft/06-beds.jpg',
    },
    {
      id: 'tables' as CategoryId,
      image: '/images/craft/07-tables.jpg',
    },
  ],
  /** Wide shop sign + craft collage (hero right panel) */
  heroBanner: '/images/hero-banner.png',
  /** Carved door — about carousel & legacy refs */
  heroImage: '/images/hero-main-door.jpg',
  developer: {
    name: 'Adwaith Brahma Tech solutions',
    url: 'https://adwaithtech.net',
  },
  visitorCount: {
    namespace: 'shankarayya-wood-shop',
    key: 'visits',
  },
}

export function telHref(phone: string) {
  return `tel:+91${phone}`
}

export function whatsappHref(message: string, phone = site.whatsappPrimary) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
