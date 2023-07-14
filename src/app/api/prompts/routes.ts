import { promptrack } from '@/server/promptrack'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const prompts = await promptrack.getPrompts()

  return NextResponse.json({
    data: prompts.map((p) => p.toObject()),
  })
}
