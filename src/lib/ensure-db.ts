import { sql } from 'drizzle-orm'
import { hashPassword } from './password'
import { db } from './db'
import { adminUsers } from './schema'

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

const DEFAULT_CATEGORIES = [
  {
    slug: 'doorFrames',
    labelEn: 'Door frames',
    labelTe: 'చౌకట్లు',
    blurbEn: 'Solid teak chaukats built to last generations.',
    blurbTe: 'బలమైన తేక చౌకట్లు — దీర్ఘకాలిక నాణ్యత.',
    imageUrl: '/images/craft/02-door-frames.jpg',
    sortOrder: 0,
  },
  {
    slug: 'doors',
    labelEn: 'Doors',
    labelTe: 'దర్వాజాలు',
    blurbEn: 'Hand-carved main doors and custom designs.',
    blurbTe: 'చేతిపని కళాకృతులతో అలంకరించిన ప్రధాన దర్వాజాలు.',
    imageUrl: '/images/craft/03-doors.jpg',
    sortOrder: 1,
  },
  {
    slug: 'windows',
    labelEn: 'Windows',
    labelTe: 'కిటికీలు',
    blurbEn: 'Classic wooden windows with clean finishing.',
    blurbTe: 'సంప్రదాయ కలప కిటికీలు — నాణ్యమైన ఫినిషింగ్.',
    imageUrl: '/images/craft/04-windows.jpg',
    sortOrder: 2,
  },
  {
    slug: 'windowShutters',
    labelEn: 'Window shutters',
    labelTe: 'కిటికీ రెక్కలు',
    blurbEn: 'Louvered shutters for light, air, and privacy.',
    blurbTe: 'వెలుతురు, గాలి మరియు గోప్యతకు రెక్కలు.',
    imageUrl: '/images/craft/05-window-shutters.jpg',
    sortOrder: 3,
  },
  {
    slug: 'beds',
    labelEn: 'Beds',
    labelTe: 'మంచాలు',
    blurbEn: 'Strong bed frames with traditional craftsmanship.',
    blurbTe: 'బలమైన తేక మంచాలు — సంప్రదాయ చేతిపని.',
    imageUrl: '/images/craft/06-beds.jpg',
    sortOrder: 4,
  },
  {
    slug: 'tables',
    labelEn: 'Tables',
    labelTe: 'టేబుల్లు',
    blurbEn: 'Dining and utility tables in pure teak.',
    blurbTe: 'శుద్ధ తేకలో డైనింగ్ మరియు ఉపయోగ టేబుల్లు.',
    imageUrl: '/images/craft/07-tables.jpg',
    sortOrder: 5,
  },
] as const

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

  const [{ n }] = await db
    .select({ n: sql<number>`count(*)` })
    .from(adminUsers)
  if (Number(n) === 0) {
    const username = process.env.ADMIN_USERNAME ?? 'admin'
    const password = process.env.ADMIN_PASSWORD ?? 'Shankarayya@2026'
    const passwordHash = await hashPassword(password)
    await db.insert(adminUsers).values({
      id: 'bootstrap-admin',
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
    })
  }
}

export function ensureDb() {
  if (!ready) {
    ready = (async () => {
      for (const sqlText of STATEMENTS) {
        await db.$client.execute(sqlText)
      }
      await seedDefaults()
    })()
  }
  return ready
}
