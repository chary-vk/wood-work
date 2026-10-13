export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createCategory, listCategories } from '@/lib/categories-server'
import { requireAdmin } from '@/lib/require-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  const categories = await listCategories()
  return NextResponse.json({ categories })
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = (await req.json()) as {
    slug?: string
    labelEn?: string
    labelTe?: string
    blurbEn?: string
    blurbTe?: string
    imageUrl?: string | null
    sortOrder?: number
  }

  try {
    const categories = await createCategory({
      slug: body.slug ?? '',
      labelEn: body.labelEn ?? '',
      labelTe: body.labelTe ?? '',
      blurbEn: body.blurbEn,
      blurbTe: body.blurbTe,
      imageUrl: body.imageUrl,
      sortOrder: body.sortOrder,
    })
    return NextResponse.json({ categories })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create category'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
