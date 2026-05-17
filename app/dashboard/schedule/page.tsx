'use client'

import { useState, useEffect } from 'react'
import { useMemo } from 'react'
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { days } from '@/lib/mock-data'
import type { Schedule } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function SchedulePage() {
  const [view, setView] = useState<'daily' | 'weekly'>('daily')
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().getDay()
    return today === 0 || today === 6 ? 0 : today - 1
  })
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)

  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/schedules')
      .then(res => res.json())
      .then(data => {
        setSchedules(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  const dynamicTimeSlots = useMemo(() => {
    const defaultSlots = ['08:30', '09:30', '10:30', '11:30', '13:00', '14:00', '15:00']
    const addedSlots = schedules.map(s => s.startTime).filter(Boolean)
    const allSlots = Array.from(new Set([...defaultSlots, ...addedSlots]))
    return allSlots.sort()
  }, [schedules])

  const currentDaySchedules = schedules.filter(s => s.day === days[selectedDay])

  const getScheduleForSlot = (day: string, time: string) => {
    return schedules.find(s => s.day === day && s.startTime === time)
  }

  const handlePrevDay = () => {
    setSelectedDay(prev => (prev === 0 ? 4 : prev - 1))
  }

  const handleNextDay = () => {
    setSelectedDay(prev => (prev === 4 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            ตารางเรียน
          </h1>
          <p className="text-muted-foreground mt-1">ดูตารางเรียนประจำสัปดาห์</p>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as 'daily' | 'weekly')}>
          <TabsList>
            <TabsTrigger value="daily">รายวัน</TabsTrigger>
            <TabsTrigger value="weekly">รายสัปดาห์</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Daily View */}
      {view === 'daily' && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={handlePrevDay}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <CardTitle className="text-xl">วัน{days[selectedDay]}</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleNextDay}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentDaySchedules.length > 0 ? (
              <div className="space-y-4">
                {currentDaySchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    onClick={() => setSelectedSchedule(schedule)}
                    className={cn(
                      'flex items-stretch gap-4 p-4 rounded-xl cursor-pointer transition-all hover:shadow-md',
                      'bg-secondary/50 hover:bg-secondary'
                    )}
                  >
                    <div className={cn('w-1.5 rounded-full', schedule.color)} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg text-foreground">{schedule.subject}</h3>
                        {schedule.isRoomChanged && (
                          <Badge variant="destructive" className="text-xs">เปลี่ยนห้อง!</Badge>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {schedule.isRoomChanged ? (
                            <>
                              <span className="line-through">{schedule.room}</span>
                              <span className="text-destructive font-medium">{schedule.newRoom}</span>
                            </>
                          ) : (
                            `ห้อง ${schedule.room}`
                          )}
                        </span>
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {schedule.teacher}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="self-center">
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">ไม่มีคาบเรียนในวันนี้</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Weekly View */}
      {view === 'weekly' && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground border-b border-border w-20">
                      เวลา
                    </th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className="p-3 text-center text-sm font-medium text-foreground border-b border-border"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dynamicTimeSlots.map((time, index) => (
                    <tr key={time} className={index % 2 === 0 ? 'bg-background' : 'bg-secondary/30'}>
                      <td className="p-3 text-sm text-muted-foreground border-r border-border font-mono">
                        {time}
                      </td>
                      {days.map((day) => {
                        const schedule = getScheduleForSlot(day, time)
                        return (
                          <td key={`${day}-${time}`} className="p-2 border-r border-border last:border-r-0">
                            {schedule ? (
                              <div
                                onClick={() => setSelectedSchedule(schedule)}
                                className={cn(
                                  'p-2 rounded-lg cursor-pointer transition-all hover:scale-105 text-white',
                                  schedule.color
                                )}
                              >
                                <p className="font-medium text-sm truncate">{schedule.subject}</p>
                                <p className="text-xs opacity-80 truncate">ห้อง {schedule.room}</p>
                                {schedule.isRoomChanged && (
                                  <Badge variant="destructive" className="text-[10px] mt-1 px-1 py-0">
                                    เปลี่ยนห้อง
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <div className="h-16" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day selector tabs for mobile */}
      {view === 'daily' && (
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {days.map((day, index) => (
            <Button
              key={day}
              variant={selectedDay === index ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDay(index)}
              className={cn(
                'flex-shrink-0',
                selectedDay === index && 'bg-primary text-primary-foreground'
              )}
            >
              {day}
            </Button>
          ))}
        </div>
      )}

      {/* Schedule Detail Dialog */}
      <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={cn('w-3 h-3 rounded-full', selectedSchedule?.color)} />
              {selectedSchedule?.subject}
            </DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-4">
              {selectedSchedule.isRoomChanged && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    ประกาศ: ย้ายห้องเรียนจาก {selectedSchedule.room} ไปห้อง {selectedSchedule.newRoom}
                  </p>
                </div>
              )}
              
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">เวลาเรียน</p>
                    <p className="font-medium">{selectedSchedule.startTime} - {selectedSchedule.endTime} น.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ห้องเรียน</p>
                    <p className="font-medium">
                      {selectedSchedule.isRoomChanged ? selectedSchedule.newRoom : selectedSchedule.room}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ผู้สอน</p>
                    <p className="font-medium">{selectedSchedule.teacher}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">วันที่เรียน</p>
                    <p className="font-medium">ทุกวัน{selectedSchedule.day}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
