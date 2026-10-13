export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { isAdminSession } from '@/lib/auth'
import { ensureDb } from '@/lib/ensure-db'
import {
  deleteGalleryPhoto,
  listGalleryPayload,
  updateGalleryPhoto,
} from '@/lib/gallery-server'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await ensureDb()
  const { id } = await params
  const body = (await req.json()) as { title?: string; category?: string }
  try {
    const payload = await updateGalleryPhoto(id, body)
    return NextResponse.json(payload)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Update failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await ensureDb()
  const { id } = await params
  await deleteGalleryPhoto(id)
  const payload = await listGalleryPayload()
  return NextResponse.json(payload)
}
