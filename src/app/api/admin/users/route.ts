export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { requireAdmin } from '@/lib/require-admin'
import { createAdminUser, listAdminUsers } from '@/lib/users-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  const users = await listAdminUsers()
  return NextResponse.json({ users })
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = (await req.json()) as { username?: string; password?: string }
  try {
    const users = await createAdminUser(
      body.username ?? '',
      body.password ?? '',
    )
    return NextResponse.json({ users })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create user'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
