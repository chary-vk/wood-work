export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { listCategories } from '@/lib/categories-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const categories = await listCategories()
  return NextResponse.json({ categories })
}
