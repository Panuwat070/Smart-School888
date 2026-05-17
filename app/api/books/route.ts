import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { title, subject, coverImage, author, description, pdfUrl } = data

    if (!title || !subject || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        subject,
        author,
        coverImage,
        description,
        pdfUrl
      }
    })

    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
  }
}
