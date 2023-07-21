import { promptrack } from '@/server/promptrack'
import { notFound } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { prompt_name: string } }
) {
  const { prompt_name: promptName } = params
  const prompt = await promptrack.getPrompt({ promptName })
  if (!prompt) {
    return notFound()
  }
  return NextResponse.json({
    data: prompt.toAPIObject(),
  })
}
