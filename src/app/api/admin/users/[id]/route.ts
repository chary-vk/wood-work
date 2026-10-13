import { requireAdmin } from '@/lib/require-admin'
import { deleteAdminUser, updateAdminUser } from '@/lib/users-server'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_req: Request, { params }: Params) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  try {
    const users = await deleteAdminUser(id)
    return NextResponse.json({ users })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not delete user'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const body = (await req.json()) as { username?: string; password?: string }
  try {
    await updateAdminUser(id, body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update user'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
