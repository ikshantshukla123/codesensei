import { NextResponse } from 'next/server'
import { generateTrinityCards } from '@/lib/ai/providers/gemini'

export async function POST(req: Request) {
  try {
    const { bug } = await req.json()

    if (!bug) {
      return NextResponse.json({ error: 'Bug data required' }, { status: 400 })
    }

    const cards = await generateTrinityCards(bug)

    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error generating trinity cards:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
