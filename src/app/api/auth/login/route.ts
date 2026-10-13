import {
  adminCredentialsValid,
  createSessionToken,
  SESSION_COOKIE,
} from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = (await req.json()) as { username?: string; password?: string }
  const username = body.username?.trim() ?? ''
  const password = body.password ?? ''

  if (!adminCredentialsValid(username, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
