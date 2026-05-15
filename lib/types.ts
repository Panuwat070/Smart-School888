export interface User {
  id: string
  studentId: string
  name: string
  email: string
  classroom: string
  avatar?: string
  role: 'student' | 'teacher' | 'admin'
}

export interface Schedule {
  id: string
  subject: string
  teacher: string
  room: string
  startTime: string
  endTime: string
  day: string
  color: string
  isRoomChanged?: boolean
  newRoom?: string
}

export interface Room {
  id: string
  name: string
  building: string
  capacity: number
  status: 'available' | 'occupied'
  currentSubject?: string
  occupiedUntil?: string
  occupiedBy?: number
}

export interface Book {
  id: string
  title: string
  subject: string
  coverImage: string
  pdfUrl: string
  author: string
  description?: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'news' | 'holiday' | 'event'
  image?: string
  createdAt: string
  author: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success'
  createdAt: string
  read: boolean
}
