import { isAdminSession } from './auth'
import { NextResponse } from 'next/server'

export async function requireAdmin() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
