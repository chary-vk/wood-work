import type { CategoryId } from '../content/site'

export type Lang = 'en' | 'te'

type CategoryCopy = Record<CategoryId, { title: string; blurb: string }>

export type Translations = {
  nav: {
    home: string
    categories: string
    gallery: string
    about: string
    contact: string
  }
  gallery: {
    title: string
    subtitle: string
    filterCategory: string
    filterYear: string
    filterMonth: string
    allCategories: string
    allYears: string
    allMonths: string
    loading: string
    empty: string
  }
  callNow: string
  whatsapp: string
  hero: {
    tagline: string
    promise: string
    teakBadge: string
    location: string
  }
  categories: {
    title: string
    subtitle: string
    items: CategoryCopy
    enquire: string
  }
  about: {
    title: string
    p1: string
    p2: string
    teakHighlight: string
    carousel: Record<
      | 'mainDoor'
      | 'doorFrames'
      | 'doors'
      | 'windows'
      | 'windowShutters'
      | 'beds'
      | 'tables',
      string
    >
    carouselPrev: string
    carouselNext: string
    carouselDots: string
    carouselSwipe: string
  }
  whyUs: {
    title: string
    items: { title: string; text: string }[]
  }
  contact: {
    title: string
    subtitle: string
    callUs: string
    sendEnquiry: string
    form: {
      name: string
      phone: string
      category: string
      message: string
      submit: string
      selectCategory: string
    }
    mapTitle: string
  }
  footer: {
    tagline: string
    followUs: string
    rights: string
    hours: string
    visitors: string
    developedBy: string
  }
  whatsappPrefill: (data: {
    name: string
    phone: string
    category: string
    message: string
  }) => string
}

const categoryEn: CategoryCopy = {
  doorFrames: {
    title: 'Door frames',
    blurb: 'Solid teak chaukats built to last generations.',
  },
  doors: {
    title: 'Doors',
    blurb: 'Hand-carved main doors and custom designs.',
  },
  windows: {
    title: 'Windows',
    blurb: 'Classic wooden windows with clean finishing.',
  },
  windowShutters: {
    title: 'Window shutters',
    blurb: 'Louvered shutters for light, air, and privacy.',
  },
  beds: {
    title: 'Beds',
    blurb: 'Strong bed frames with traditional craftsmanship.',
  },
  tables: {
    title: 'Tables',
    blurb: 'Dining and utility tables in pure teak.',
  },
}

const categoryTe: CategoryCopy = {
  doorFrames: {
    title: 'చౌకట్లు',
    blurb: 'బలమైన తేక చౌకట్లు — దీర్ఘకాలిక నాణ్యత.',
  },
  doors: {
    title: 'దర్వాజాలు',
    blurb: 'చేతిపని కళాకృతులతో అలంకరించిన ప్రధాన దర్వాజాలు.',
  },
  windows: {
    title: 'కిటికీలు',
    blurb: 'సంప్రదాయ కలప కిటికీలు — నాణ్యమైన ఫినిషింగ్.',
  },
  windowShutters: {
    title: 'కిటికీ రెక్కలు',
    blurb: 'వెలుతురు, గాలి మరియు గోప్యతకు రెక్కలు.',
  },
  beds: {
    title: 'మంచాలు',
    blurb: 'బలమైన తేక మంచాలు — సంప్రదాయ చేతిపని.',
  },
  tables: {
    title: 'టేబుల్లు',
    blurb: 'డైనింగ్ మరియు యుటిలిటీ టేబుల్లు — 100% తేక.',
  },
}

export const translations: Record<Lang, Translations> = {
  en: {
    nav: {
      home: 'Home',
      categories: 'Categories',
      gallery: 'Gallery',
      about: 'About',
      contact: 'Contact',
    },
    gallery: {
      title: 'Workshop gallery',
      subtitle:
        'Recent projects grouped by month — filter by category, year, or month.',
      filterCategory: 'Category',
      filterYear: 'Year',
      filterMonth: 'Month',
      allCategories: 'All categories',
      allYears: 'All years',
      allMonths: 'All months',
      loading: 'Loading gallery…',
      empty: 'No photos yet. Check back soon.',
    },
    callNow: 'Call now',
    whatsapp: 'WhatsApp',
    hero: {
      tagline: 'Quality is another name for trust',
      promise: 'We give your dream home the shape of our craft',
      teakBadge: '100% Teak Wood',
      location: 'Custom furniture',
    },
    categories: {
      title: 'What we craft',
      subtitle: 'Doors, windows, beds, and more — made to your measurements.',
      items: categoryEn,
      enquire: 'Enquire about this',
    },
    about: {
      title: 'Craft rooted in teak',
      p1: 'At Shankarayya Wooden Furniture Works, every piece is shaped by skilled hands using genuine teak wood. From ornate main doors to everyday furniture, we build for strength and beauty.',
      p2: 'Tell us your plan — size, design, and finish — and we work with you until it fits your home perfectly.',
      teakHighlight: '100% teak · Custom-made · Built to last',
      carousel: {
        mainDoor: 'Hand-carved main door',
        doorFrames: 'Ornate door frames',
        doors: 'Teak panel doors',
        windows: 'Wooden windows',
        windowShutters: 'Window shutters',
        beds: 'Carved bed frames',
        tables: 'Dining tables',
      },
      carouselPrev: 'Previous photo',
      carouselNext: 'Next photo',
      carouselDots: 'Workshop photos',
      carouselSwipe: 'Swipe left or right for more work',
    },
    whyUs: {
      title: 'Why families choose us',
      items: [
        {
          title: 'Premium teak',
          text: 'We use high-quality teak wood for lasting strength.',
        },
        {
          title: 'Responsible work',
          text: 'Solid construction and careful finishing on every job.',
        },
        {
          title: 'Beautiful design',
          text: 'Traditional and modern looks tailored to your taste.',
        },
        {
          title: 'Made for you',
          text: 'Custom sizes and designs based on your needs.',
        },
      ],
    },
    contact: {
      title: 'Contact us',
      subtitle: 'Call, WhatsApp, or send an enquiry — we respond quickly.',
      callUs: 'Talk to us',
      sendEnquiry: 'Send enquiry',
      form: {
        name: 'Your name',
        phone: 'Phone number',
        category: 'Product category',
        message: 'Your requirements',
        submit: 'Send on WhatsApp',
        selectCategory: 'Select a category',
      },
      mapTitle: 'Visit our workshop',
    },
    footer: {
      tagline: 'Quality is another name for trust',
      followUs: 'Follow us',
      rights: 'All rights reserved.',
      hours: 'Open daily · Custom orders welcome',
      visitors: 'Visitors',
      developedBy: 'Developed by',
    },
    whatsappPrefill: ({ name, phone, category, message }) =>
      `Hello, I would like an enquiry from your website.\n\nName: ${name}\nPhone: ${phone}\nCategory: ${category}\n\n${message}`,
  },
  te: {
    nav: {
      home: 'హోమ్',
      categories: 'వర్గాలు',
      gallery: 'గ్యాలరీ',
      about: 'మా గురించి',
      contact: 'సంప్రదించండి',
    },
    gallery: {
      title: 'వర్క్‌షాప్ గ్యాలరీ',
      subtitle:
        'నెల వారీగా చూడండి — వర్గం, సంవత్సరం లేదా నెల ద్వారా ఫిల్టర్ చేయండి.',
      filterCategory: 'వర్గం',
      filterYear: 'సంవత్సరం',
      filterMonth: 'నెల',
      allCategories: 'అన్ని వర్గాలు',
      allYears: 'అన్ని సంవత్సరాలు',
      allMonths: 'అన్ని నెలలు',
      loading: 'గ్యాలరీ లోడ్ అవుతోంది…',
      empty: 'ఇంకా చిత్రాలు లేవు. త్వరలో చూడండి.',
    },
    callNow: 'ఇప్పుడే కాల్',
    whatsapp: 'వాట్సాప్',
    hero: {
      tagline: 'నాణ్యత నమ్మకానికి మారుపేరు',
      promise: 'మీ కలల ఇంటికి మా చేతిపని రూపం ఇస్తాం',
      teakBadge: '100% తేక',
      location: 'కస్టమ్ ఫర్నిచర్',
    },
    categories: {
      title: 'మేము తయారు చేసేవి',
      subtitle: 'దర్వాజాలు, కిటికీలు, మంచాలు మరియు మరిన్ని — మీ కొలతలకు.',
      items: categoryTe,
      enquire: 'దీని గురించి అడగండి',
    },
    about: {
      title: 'తేకలో నిల్వ ఉన్న చేతిపని',
      p1: 'శంకరయ్య వుడెన్ ఫర్నిచర్ వర్క్స్‌లో ప్రతి పని నిజమైన తేకతో, అనుభవజ్ఞులైన కార్మికుల చేతుల్లో రూపొందుతుంది. అలంకరించిన ప్రధాన దర్వాజాల నుంచి రోజువారీ furniture వరకు — బలం మరియు అందం రెండూ.',
      p2: 'మీ అవసరం, కొలత, డిజైన్ చెప్పండి — మీ ఇంటికి సరిపడేలా మేము పని చేస్తాము.',
      teakHighlight: '100% తేక · కస్టమ్ · దీర్ఘకాలిక',
      carousel: {
        mainDoor: 'చేతిపని ప్రధాన దర్వాజా',
        doorFrames: 'అలంకరించిన చౌకట్లు',
        doors: 'తేక దర్వాజాలు',
        windows: 'కలప కిటికీలు',
        windowShutters: 'కిటికీ రెక్కలు',
        beds: 'చేతిపని మంచాలు',
        tables: 'డైనింగ్ టేబుల్లు',
      },
      carouselPrev: 'మునుపటి చిత్రం',
      carouselNext: 'తర్వాత చిత్రం',
      carouselDots: 'మా పని చిత్రాలు',
      carouselSwipe: 'మరిన్ని చూడటానికి ఎడమ/కుడి swipe చేయండి',
    },
    whyUs: {
      title: 'మమ్మల్ని ఎందుకు ఎంచుకుంటారు',
      items: [
        {
          title: 'నాణ్యమైన తేక',
          text: 'బలమైన నిర్మాణం కోసం ఉత్తమ-grade తేక.',
        },
        {
          title: 'జవాబుదారీతనం',
          text: 'ప్రతి పనిలో గట్టి నిర్మాణం, శ్రద్ధగా ఫినిషింగ్.',
        },
        {
          title: 'అందమైన డిజైన్',
          text: 'సంప్రదాయ మరియు ఆధునిక రూపాలు — మీ రుచికి.',
        },
        {
          title: 'మీ అవసరానికి',
          text: 'మీ measurements మరియు డిజైన్ ప్రకారం తయారీ.',
        },
      ],
    },
    contact: {
      title: 'సంప్రదించండి',
      subtitle: 'కాల్, వాట్సాప్ లేదా enquiry — మేము త్వరగా స్పందిస్తాము.',
      callUs: 'మాతో మాట్లాడండి',
      sendEnquiry: 'Enquiry పంపండి',
      form: {
        name: 'మీ పేరు',
        phone: 'ఫోన్ నంబర్',
        category: 'ఉత్పత్తి వర్గం',
        message: 'మీ అవసరాలు',
        submit: 'వాట్సాప్‌లో పంపండి',
        selectCategory: 'వర్గం ఎంచుకోండి',
      },
      mapTitle: 'మా workshopకి రండి',
    },
    footer: {
      tagline: 'నాణ్యత నమ్మకానికి మారుపేరు',
      followUs: 'మమ్మల్ని అనుసరించండి',
      rights: 'అన్ని హక్కులు రక్షించబడ్డాయి.',
      hours: 'ప్రతిరోజు · కస్టమ్ ఆర్డర్లు స్వాగతం',
      visitors: 'సందర్శకులు',
      developedBy: 'అభివృద్ధి',
    },
    whatsappPrefill: ({ name, phone, category, message }) =>
      `నమస్కారం, మీ website నుంచి enquiry.\n\nపేరు: ${name}\nఫోన్: ${phone}\nవర్గం: ${category}\n\n${message}`,
  },
}

export function categoryLabel(lang: Lang, id: CategoryId): string {
  return translations[lang].categories.items[id].title
}
