import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'wood-shop-session'

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? 'dev-only-change-auth-secret',
  )
}

export async function createSessionToken(userId: string, username: string) {
  return new SignJWT({ role: 'admin', sub: userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret())
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret())
    if (payload.role !== 'admin' || typeof payload.sub !== 'string') return null
    return {
      userId: payload.sub,
      username: typeof payload.username === 'string' ? payload.username : '',
    }
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function isAdminSession() {
  return (await getAdminSession()) !== null
}
