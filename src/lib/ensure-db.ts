import { hashPassword } from './password'
import { db } from './db'

let ready: Promise<void> | null = null

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS gallery_photos (
    id TEXT PRIMARY KEY NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    uploaded_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS gallery_categories (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    label_en TEXT NOT NULL,
    label_te TEXT NOT NULL,
    blurb_en TEXT NOT NULL,
    blurb_te TEXT NOT NULL,
    image_url TEXT,
    sort_order INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
]

const DEFAULT_CATEGORIES: Array<{
  slug: string
  labelEn: string
  labelTe: string
  blurbEn: string
  blurbTe: string
  imageUrl: string
  sortOrder: number
}> = [
  {
    slug: 'doorFrames',
    labelEn: 'Door frames',
    labelTe: 'తలుపు చౌకట్లు',
    blurbEn: 'Solid teak chaukats built to last generations.',
    blurbTe: 'తరతరాలపాటు నిలిచే బ-solid teak చౌకట్లు.',
    imageUrl: '/images/craft/02-door-frames.jpg',
    sortOrder: 0,
  },
  {
    slug: 'doors',
    labelEn: 'Doors',
    labelTe: 'తలుపులు',
    blurbEn: 'Carved and plain teak doors for homes and temples.',
    blurbTe: 'ఇళ్లు, దేవాలయాలకు చెక్కిన మరియు సాధారణ teak తలుపులు.',
    imageUrl: '/images/craft/03-doors.jpg',
    sortOrder: 1,
  },
  {
    slug: 'windows',
    labelEn: 'Windows',
    labelTe: 'కిటికీలు',
    blurbEn: 'Teak window frames with clean joinery.',
    blurbTe: 'శుభ్రమైన joinery తో teak కిటికీ చౌకats.',
    imageUrl: '/images/craft/04-windows.jpg',
    sortOrder: 2,
  },
  {
    slug: 'windowShutters',
    labelEn: 'Window shutters',
    labelTe: 'కిటికీ రెక్కలు',
    blurbEn: 'Traditional shutters matched to your frames.',
    blurbTe: 'మీ చౌకatsకు సరిపడే సంప్రదాయ రెక్కలు.',
    imageUrl: '/images/craft/05-window-shutters.jpg',
    sortOrder: 3,
  },
  {
    slug: 'beds',
    labelEn: 'Beds',
    labelTe: 'మంచాలు',
    blurbEn: 'Sturdy teak cots and bed frames.',
    blurbTe: 'బలమైన teak మంచాలు మరియు bed frames.',
    imageUrl: '/images/craft/06-beds.jpg',
    sortOrder: 4,
  },
  {
    slug: 'tables',
    labelEn: 'Tables',
    labelTe: 'టేబుల్స్',
    blurbEn: 'Dining and work tables in pure teak.',
    blurbTe: 'శుద్ధ teakలో dining మరియు work tables.',
    imageUrl: '/images/craft/07-tables.jpg',
    sortOrder: 5,
  },
]

async function seedDefaults() {
  for (const cat of DEFAULT_CATEGORIES) {
    await db.$client.execute({
      sql: `INSERT OR IGNORE INTO gallery_categories
        (id, slug, label_en, label_te, blurb_en, blurb_te, image_url, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        cat.slug,
        cat.slug,
        cat.labelEn,
        cat.labelTe,
        cat.blurbEn,
        cat.blurbTe,
        cat.imageUrl,
        cat.sortOrder,
      ],
    })
  }

  const users = await db.$client.execute(
    'SELECT COUNT(*) AS n FROM admin_users',
  )
  const count = Number(users.rows[0]?.n ?? 0)
  if (count === 0) {
    const username = process.env.ADMIN_USERNAME ?? 'admin'
    const password = process.env.ADMIN_PASSWORD ?? 'Shankarayya@2026'
    const passwordHash = await hashPassword(password)
    await db.$client.execute({
      sql: `INSERT INTO admin_users (id, username, password_hash, created_at)
            VALUES (?, ?, ?, ?)`,
      args: ['bootstrap-admin', username, passwordHash, new Date().toISOString()],
    })
  }
}

export function ensureDb() {
  if (!ready) {
    ready = (async () => {
      for (const sql of STATEMENTS) {
        await db.$client.execute(sql)
      }
      await seedDefaults()
    })()
  }
  return ready
}
