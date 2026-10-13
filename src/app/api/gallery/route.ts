export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { isAdminSession } from '@/lib/auth'
import { ensureDb } from '@/lib/ensure-db'
import { addGalleryPhotos, listGalleryPayload } from '@/lib/gallery-server'
import { NextResponse } from 'next/server'

export async function GET() {
  await ensureDb()
  const payload = await listGalleryPayload()
  return NextResponse.json(payload)
}

export async function POST(req: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await ensureDb()
  const form = await req.formData()
  const category = String(form.get('category') ?? '')
  const title = form.get('title') ? String(form.get('title')) : undefined
  const photos = form.getAll('photos').filter((v): v is File => v instanceof File)

  if (!photos.length) {
    return NextResponse.json({ error: 'No photos provided' }, { status: 400 })
  }

  try {
    const payload = await addGalleryPhotos(photos, category, title)
    return NextResponse.json(payload)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
