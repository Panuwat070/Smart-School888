import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(announcements)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const announcement = await prisma.announcement.create({
      data: {
        title: json.title,
        content: json.content,
        type: json.type,
        image: json.image,
        author: json.author || 'ฝ่ายวิชาการ',
      }
    })
    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}
