import { PrismaClient } from '@prisma/client'
import { mockUser, mockSchedules, mockRooms, mockAnnouncements, mockNotifications } from '../lib/mock-data'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // Seed User
  await prisma.user.upsert({
    where: { studentId: mockUser.studentId },
    update: {},
    create: {
      studentId: mockUser.studentId,
      name: mockUser.name,
      email: mockUser.email,
      password: 'student123',
      classroom: mockUser.classroom,
      avatar: mockUser.avatar,
      role: mockUser.role,
    },
  })

  // Seed Admin
  await prisma.user.upsert({
    where: { studentId: 'admin' },
    update: { password: 'admin123' },
    create: {
      studentId: 'admin',
      name: 'ผู้ดูแลระบบ',
      email: 'admin@school.ac.th',
      password: 'admin123',
      classroom: '-',
      role: 'admin',
    },
  })

  // Seed Schedules
  for (const schedule of mockSchedules) {
    await prisma.schedule.create({
      data: {
        subject: schedule.subject,
        teacher: schedule.teacher,
        room: schedule.room,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        day: schedule.day,
        color: schedule.color,
        isRoomChanged: schedule.isRoomChanged ?? false,
        newRoom: schedule.newRoom,
      },
    })
  }

  // Seed Rooms
  for (const room of mockRooms) {
    await prisma.room.create({
      data: {
        name: room.name,
        building: room.building,
        capacity: room.capacity,
        status: room.status,
        currentSubject: room.currentSubject,
        occupiedUntil: room.occupiedUntil,
        occupiedBy: room.occupiedBy,
      },
    })
  }

  // Seed Announcements
  for (const announcement of mockAnnouncements) {
    await prisma.announcement.create({
      data: {
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        image: announcement.image,
        createdAt: new Date(announcement.createdAt),
        author: announcement.author,
      },
    })
  }

  // Seed Notifications
  for (const notification of mockNotifications) {
    await prisma.notification.create({
      data: {
        title: notification.title,
        message: notification.message,
        type: notification.type,
        createdAt: new Date(notification.createdAt),
        read: notification.read,
      },
    })
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
