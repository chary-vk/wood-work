import { createSessionToken, SESSION_COOKIE } from '@/lib/auth'
import { authenticateAdmin } from '@/lib/users-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = (await req.json()) as { username?: string; password?: string }
  const username = body.username?.trim() ?? ''
  const password = body.password ?? ''

  const user = await authenticateAdmin(username, password)
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await createSessionToken(user.id, user.username)
  const res = NextResponse.json({ ok: true, username: user.username })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
