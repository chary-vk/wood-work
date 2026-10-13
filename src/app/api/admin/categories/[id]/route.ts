export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { deleteCategory, updateCategory } from '@/lib/categories-server'
import { requireAdmin } from '@/lib/require-admin'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const body = (await req.json()) as {
    labelEn?: string
    labelTe?: string
    blurbEn?: string
    blurbTe?: string
    imageUrl?: string | null
    sortOrder?: number
  }

  try {
    const categories = await updateCategory(id, body)
    return NextResponse.json({ categories })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update category'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  try {
    const categories = await deleteCategory(id)
    return NextResponse.json({ categories })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not delete category'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
