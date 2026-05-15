import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany()
    return NextResponse.json(schedules)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const schedule = await prisma.schedule.create({
      data: {
        subject: json.subject,
        teacher: json.teacher,
        room: json.room,
        startTime: json.startTime,
        endTime: json.endTime,
        day: json.day,
        color: json.color,
        isRoomChanged: json.isRoomChanged || false,
        newRoom: json.newRoom,
      }
    })
    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 })
  }
}
