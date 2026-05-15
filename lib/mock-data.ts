import type { User, Schedule, Room, Book, Announcement, Notification } from './types'

export const mockUser: User = {
  id: '1',
  studentId: '65010001',
  name: 'สมชาย ใจดี',
  email: 'somchai@school.ac.th',
  classroom: 'ม.6/1',
  avatar: '/avatars/student.png',
  role: 'student'
}

export const mockSchedules: Schedule[] = []

export const mockRooms: Room[] = []

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'คณิตศาสตร์ ม.6 เล่ม 1',
    subject: 'คณิตศาสตร์',
    coverImage: '/books/math-cover.jpg',
    pdfUrl: '/books/math-m6-1.pdf',
    author: 'สสวท.',
    description: 'หนังสือเรียนคณิตศาสตร์ระดับมัธยมศึกษาปีที่ 6'
  },
  {
    id: '2',
    title: 'ภาษาอังกฤษ ม.6',
    subject: 'ภาษาอังกฤษ',
    coverImage: '/books/english-cover.jpg',
    pdfUrl: '/books/english-m6.pdf',
    author: 'กระทรวงศึกษาธิการ',
    description: 'หนังสือเรียนภาษาอังกฤษระดับมัธยมศึกษาปีที่ 6'
  },
  {
    id: '3',
    title: 'ฟิสิกส์ ม.6 เล่ม 1',
    subject: 'วิทยาศาสตร์',
    coverImage: '/books/physics-cover.jpg',
    pdfUrl: '/books/physics-m6-1.pdf',
    author: 'สสวท.',
    description: 'หนังสือเรียนฟิสิกส์ระดับมัธยมศึกษาปีที่ 6'
  },
  {
    id: '4',
    title: 'เคมี ม.6 เล่ม 1',
    subject: 'วิทยาศาสตร์',
    coverImage: '/books/chemistry-cover.jpg',
    pdfUrl: '/books/chemistry-m6-1.pdf',
    author: 'สสวท.',
    description: 'หนังสือเรียนเคมีระดับมัธยมศึกษาปีที่ 6'
  },
  {
    id: '5',
    title: 'ชีววิทยา ม.6 เล่ม 1',
    subject: 'วิทยาศาสตร์',
    coverImage: '/books/biology-cover.jpg',
    pdfUrl: '/books/biology-m6-1.pdf',
    author: 'สสวท.',
    description: 'หนังสือเรียนชีววิทยาระดับมัธยมศึกษาปีที่ 6'
  },
  {
    id: '6',
    title: 'ภาษาไทย ม.6',
    subject: 'ภาษาไทย',
    coverImage: '/books/thai-cover.jpg',
    pdfUrl: '/books/thai-m6.pdf',
    author: 'กระทรวงศึกษาธิการ',
    description: 'หนังสือเรียนภาษาไทยระดับมัธยมศึกษาปีที่ 6'
  },
  {
    id: '7',
    title: 'สังคมศึกษา ม.6',
    subject: 'สังคมศึกษา',
    coverImage: '/books/social-cover.jpg',
    pdfUrl: '/books/social-m6.pdf',
    author: 'กระทรวงศึกษาธิการ',
    description: 'หนังสือเรียนสังคมศึกษาระดับมัธยมศึกษาปีที่ 6'
  },
  {
    id: '8',
    title: 'คอมพิวเตอร์ ม.6',
    subject: 'คอมพิวเตอร์',
    coverImage: '/books/computer-cover.jpg',
    pdfUrl: '/books/computer-m6.pdf',
    author: 'สสวท.',
    description: 'หนังสือเรียนวิทยาการคำนวณระดับมัธยมศึกษาปีที่ 6'
  }
]

export const mockAnnouncements: Announcement[] = []

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'เปลี่ยนห้องเรียน',
    message: 'วิชาวิทยาศาสตร์วันนี้ย้ายไปห้อง 405',
    type: 'warning',
    createdAt: '2024-01-11T07:30:00',
    read: false
  },
  {
    id: '2',
    title: 'คาบเรียนถัดไป',
    message: 'อีก 10 นาที วิชาภาษาอังกฤษ ห้อง 302',
    type: 'info',
    createdAt: '2024-01-11T09:10:00',
    read: false
  },
  {
    id: '3',
    title: 'ส่งการบ้านสำเร็จ',
    message: 'การบ้านวิชาคณิตศาสตร์ถูกบันทึกเรียบร้อย',
    type: 'success',
    createdAt: '2024-01-10T16:00:00',
    read: true
  }
]

export const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์']
export const subjects = ['คณิตศาสตร์', 'ภาษาอังกฤษ', 'วิทยาศาสตร์', 'ภาษาไทย', 'สังคมศึกษา', 'คอมพิวเตอร์']
export const buildings = ['อาคาร 1', 'อาคาร 2', 'อาคาร 3', 'อาคาร 4 (วิทยาศาสตร์)', 'อาคาร 5']
