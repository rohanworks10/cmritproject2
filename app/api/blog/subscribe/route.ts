import { NextResponse } from 'next/server'
import { toggleSubscription } from '@/lib/blog-storage'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const authorId = String(body?.authorId || '')
    const subscriberId = String(body?.subscriberId || 'guest')
    if (!authorId) {
      return NextResponse.json({ success: false, error: 'Missing authorId' }, { status: 400 })
    }
    const result = toggleSubscription(authorId, subscriberId)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to toggle subscription' }, { status: 500 })
  }
}
