export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { isAdminSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await isAdminSession()
  return NextResponse.json({ admin })
}
