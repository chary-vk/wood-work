import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const galleryPhotos = sqliteTable('gallery_photos', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  uploadedAt: text('uploaded_at').notNull(),
})

export const galleryCategories = sqliteTable('gallery_categories', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  labelEn: text('label_en').notNull(),
  labelTe: text('label_te').notNull(),
  blurbEn: text('blurb_en').notNull(),
  blurbTe: text('blurb_te').notNull(),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').notNull(),
})

export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull(),
})

export type GalleryPhoto = typeof galleryPhotos.$inferSelect
