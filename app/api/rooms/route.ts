import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany()
    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const room = await prisma.room.create({
      data: {
        name: json.name,
        building: json.building,
        capacity: Number(json.capacity),
        status: json.status || 'available',
        currentSubject: json.currentSubject,
        occupiedUntil: json.occupiedUntil,
        occupiedBy: json.occupiedBy ? Number(json.occupiedBy) : null,
      }
    })
    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 })
  }
}
