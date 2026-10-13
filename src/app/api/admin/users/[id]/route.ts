import { requireAdmin } from '@/lib/require-admin'
import { deleteAdminUser, updateAdminPassword } from '@/lib/users-server'
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
  const body = (await req.json()) as { password?: string }
  try {
    await updateAdminPassword(id, body.password ?? '')
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update password'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
