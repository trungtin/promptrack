import { promptrack } from '@/server/promptrack'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { prompt_name: string } }
) {
  const { prompt_name: promptName } = params
  const prompt = await promptrack.getPrompt({ promptName })
  return NextResponse.json({
    data: prompt.toObject(),
  })
}
