import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { userId, password, role } = json

    const user = await prisma.user.findFirst({
      where: {
        AND: [
          { studentId: userId },
          { role: role }
        ]
      }
    })

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      studentId: user.studentId,
      name: user.name,
      email: user.email,
      classroom: user.classroom,
      role: user.role
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 })
  }
}
