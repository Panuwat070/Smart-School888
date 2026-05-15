'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  DoorOpen,
  BookOpen,
  Megaphone,
  Clock,
  MapPin,
  ArrowRight,
  Bell,
  CalendarCog,
  DoorClosed,
  Users,
  Settings,
  Building2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockNotifications, days } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { Schedule, Announcement, Room } from '@/lib/types'

const studentQuickActions = [
  { icon: Calendar, label: 'ตารางเรียน', href: '/dashboard/schedule', color: 'bg-blue-500' },
  { icon: DoorOpen, label: 'ห้องว่าง', href: '/dashboard/rooms', color: 'bg-emerald-500' },
  { icon: BookOpen, label: 'หนังสือเรียน', href: '/dashboard/books', color: 'bg-purple-500' },
  { icon: Megaphone, label: 'ประกาศ', href: '/dashboard/announcements', color: 'bg-orange-500' },
]

const adminQuickActions = [
  { icon: CalendarCog, label: 'จัดการตารางเรียน', href: '/dashboard/admin/schedules', color: 'bg-blue-500' },
  { icon: DoorClosed, label: 'จัดการห้องเรียน', href: '/dashboard/admin/rooms', color: 'bg-emerald-500' },
  { icon: Bell, label: 'จัดการประกาศ', href: '/dashboard/admin/announcements', color: 'bg-orange-500' },
  { icon: Settings, label: 'โปรไฟล์', href: '/dashboard/profile', color: 'bg-slate-500' },
]

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    const savedUser = localStorage.getItem('school_user')
    if (savedUser) setUser(JSON.parse(savedUser))

    Promise.all([
      fetch('/api/schedules').then(res => res.json()),
      fetch('/api/announcements').then(res => res.json()),
      fetch('/api/rooms').then(res => res.json())
    ]).then(([schedulesData, announcementsData, roomsData]) => {
      setSchedules(schedulesData)
      setAnnouncements(announcementsData)
      setRooms(roomsData)
    }).catch(err => console.error('Failed to fetch dashboard data:', err))

    return () => clearInterval(timer)
  }, [])

  const isAdmin = user?.role === 'admin'

  // Get current day in Thai
  const dayIndex = currentTime.getDay()
  const currentDay = dayIndex === 0 ? 'อาทิตย์' : dayIndex === 6 ? 'เสาร์' : days[dayIndex - 1]
  
  // Get today's schedule
  const todaySchedules = schedules.filter(s => s.day === currentDay)
  
  // Find current and next class
  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
  
  const currentClass = todaySchedules.find(s => {
    return currentTimeStr >= s.startTime && currentTimeStr < s.endTime
  })
  
  const nextClass = todaySchedules.find(s => s.startTime > currentTimeStr)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const quickActions = isAdmin ? adminQuickActions : studentQuickActions

  // Admin stats
  const totalSchedules = schedules.length
  const totalRooms = rooms.length
  const availableRooms = rooms.filter(r => r.status === 'available').length
  const totalAnnouncements = announcements.length

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            สวัสดี, {user?.name?.split(' ')[0] || (isAdmin ? 'ผู้ดูแลระบบ' : 'นักเรียน')}
          </h1>
          <p className="text-muted-foreground mt-1">{formatDate(currentTime)}</p>
        </div>
        <div className="flex items-center gap-2 text-4xl font-mono font-bold text-primary">
          <Clock className="w-8 h-8" />
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
              <CardContent className="p-4 flex flex-col items-center gap-3">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110', action.color)}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-foreground text-center text-sm">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Admin Dashboard Content */}
      {isAdmin ? (
        <>
          {/* Admin Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">ตารางเรียนทั้งหมด</p>
                    <p className="text-2xl font-bold">{totalSchedules}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <CalendarCog className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">ห้องเรียนทั้งหมด</p>
                    <p className="text-2xl font-bold">{totalRooms}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">ห้องว่าง</p>
                    <p className="text-2xl font-bold text-emerald-500">{availableRooms}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <DoorOpen className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">ประกาศทั้งหมด</p>
                    <p className="text-2xl font-bold">{totalAnnouncements}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Announcements */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-orange-500" />
                  ประกาศล่าสุด
                </CardTitle>
                <Link href="/dashboard/admin/announcements">
                  <Button variant="ghost" size="sm" className="text-orange-500">
                    จัดการ
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.slice(0, 4).map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs',
                            announcement.type === 'holiday' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                            announcement.type === 'event' && 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
                            announcement.type === 'news' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          )}
                        >
                          {announcement.type === 'holiday' ? 'วันหยุด' : announcement.type === 'event' ? 'กิจกรรม' : 'ข่าวสาร'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(announcement.createdAt).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                      <h4 className="font-medium text-foreground text-sm line-clamp-1">{announcement.title}</h4>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DoorClosed className="w-5 h-5 text-emerald-500" />
                  สถานะห้องเรียน
                </CardTitle>
                <Link href="/dashboard/admin/rooms">
                  <Button variant="ghost" size="sm" className="text-emerald-500">
                    จัดการ
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rooms.slice(0, 5).map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-3 h-3 rounded-full',
                          room.status === 'available' ? 'bg-emerald-500' : 'bg-orange-500'
                        )} />
                        <div>
                          <p className="font-medium text-foreground text-sm">{room.name}</p>
                          <p className="text-xs text-muted-foreground">{room.building}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          room.status === 'available'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        )}
                      >
                        {room.status === 'available' ? 'ว่าง' : 'ไม่ว่าง'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Student Dashboard Content */}
          {/* Main content grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's schedule */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">ตารางเรียนวันนี้</CardTitle>
                <Link href="/dashboard/schedule">
                  <Button variant="ghost" size="sm" className="text-primary">
                    ดูทั้งหมด
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {todaySchedules.length > 0 ? (
                  <div className="space-y-3">
                    {todaySchedules.slice(0, 5).map((schedule) => {
                      const isCurrentClass = currentClass?.id === schedule.id
                      const isPastClass = schedule.endTime < currentTimeStr
                      
                      return (
                        <div
                          key={schedule.id}
                          className={cn(
                            'flex items-center gap-4 p-3 rounded-xl transition-all',
                            isCurrentClass && 'bg-primary/10 border border-primary/30',
                            isPastClass && 'opacity-50',
                            !isCurrentClass && !isPastClass && 'bg-secondary/50'
                          )}
                        >
                          <div className={cn('w-1 h-12 rounded-full', schedule.color)} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground truncate">{schedule.subject}</span>
                              {isCurrentClass && (
                                <Badge className="bg-primary text-primary-foreground text-xs">กำลังเรียน</Badge>
                              )}
                              {schedule.isRoomChanged && (
                                <Badge variant="destructive" className="text-xs">เปลี่ยนห้อง</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {schedule.startTime} - {schedule.endTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {schedule.isRoomChanged ? (
                                  <span className="text-destructive">{schedule.newRoom}</span>
                                ) : (
                                  schedule.room
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            {schedule.teacher}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>วันนี้ไม่มีคาบเรียน</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Side cards */}
            <div className="space-y-6">
              {/* Current/Next class */}
              <Card className="bg-gradient-to-br from-primary to-accent text-white">
                <CardContent className="p-5">
                  {currentClass ? (
                    <>
                      <p className="text-white/80 text-sm">กำลังเรียน</p>
                      <h3 className="text-xl font-bold mt-1">{currentClass.subject}</h3>
                      <div className="mt-3 space-y-1 text-white/90 text-sm">
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {currentClass.startTime} - {currentClass.endTime}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          ห้อง {currentClass.isRoomChanged ? currentClass.newRoom : currentClass.room}
                        </p>
                      </div>
                    </>
                  ) : nextClass ? (
                    <>
                      <p className="text-white/80 text-sm">วิชาถัดไป</p>
                      <h3 className="text-xl font-bold mt-1">{nextClass.subject}</h3>
                      <div className="mt-3 space-y-1 text-white/90 text-sm">
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {nextClass.startTime} - {nextClass.endTime}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          ห้อง {nextClass.isRoomChanged ? nextClass.newRoom : nextClass.room}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-white/80 text-sm">วันนี้</p>
                      <h3 className="text-xl font-bold mt-1">หมดคาบเรียนแล้ว</h3>
                      <p className="mt-3 text-white/90 text-sm">พักผ่อนให้สบาย!</p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    การแจ้งเตือน
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockNotifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-3 rounded-lg',
                          !notification.read ? 'bg-primary/5' : 'bg-secondary/50'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full',
                              notification.type === 'warning' && 'bg-warning',
                              notification.type === 'info' && 'bg-primary',
                              notification.type === 'success' && 'bg-success'
                            )}
                          />
                          <span className="font-medium text-sm text-foreground">{notification.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 pl-4">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Announcements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                ข่าวประกาศล่าสุด
              </CardTitle>
              <Link href="/dashboard/announcements">
                <Button variant="ghost" size="sm" className="text-primary">
                  ดูทั้งหมด
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {announcements.slice(0, 3).map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          announcement.type === 'holiday' && 'bg-destructive/10 text-destructive',
                          announcement.type === 'event' && 'bg-primary/10 text-primary',
                          announcement.type === 'news' && 'bg-warning/10 text-warning'
                        )}
                      >
                        {announcement.type === 'holiday' ? 'หยุด' : announcement.type === 'event' ? 'กิจกรรม' : 'ข่าว'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(announcement.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground line-clamp-1">{announcement.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
