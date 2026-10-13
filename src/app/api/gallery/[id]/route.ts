import { isAdminSession } from '@/lib/auth'
import { ensureDb } from '@/lib/ensure-db'
import { deleteGalleryPhoto, listGalleryPayload } from '@/lib/gallery-server'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

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
