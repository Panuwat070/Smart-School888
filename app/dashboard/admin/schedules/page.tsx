'use client'

import { useState, useEffect } from 'react'
import { 
  CalendarCog, 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  X,
  Save,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { days, subjects } from '@/lib/mock-data'
import type { Schedule } from '@/lib/types'
import { cn } from '@/lib/utils'

const colorOptions = [
  { value: 'bg-blue-500', label: 'น้ำเงิน' },
  { value: 'bg-emerald-500', label: 'เขียวมรกต' },
  { value: 'bg-purple-500', label: 'ม่วง' },
  { value: 'bg-orange-500', label: 'ส้ม' },
  { value: 'bg-rose-500', label: 'ชมพู' },
  { value: 'bg-teal-500', label: 'เขียวน้ำทะเล' },
  { value: 'bg-indigo-500', label: 'คราม' },
  { value: 'bg-cyan-500', label: 'ฟ้า' },
  { value: 'bg-pink-500', label: 'ชมพูอ่อน' },
  { value: 'bg-amber-500', label: 'อำพัน' },
]

const emptySchedule: Partial<Schedule> = {
  subject: '',
  teacher: '',
  room: '',
  startTime: '',
  endTime: '',
  day: '',
  color: 'bg-blue-500'
}

export default function AdminSchedulesPage() {
  const { toast } = useToast()
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDay, setFilterDay] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Partial<Schedule> | null>(null)
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null)

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      schedule.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.room.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDay = filterDay === 'all' || schedule.day === filterDay
    return matchesSearch && matchesDay
  })

  const handleAddNew = () => {
    setEditingSchedule({ ...emptySchedule, id: `new-${Date.now()}` })
    setIsDialogOpen(true)
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule({ ...schedule })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (schedule: Schedule) => {
    setScheduleToDelete(schedule)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (scheduleToDelete) {
      try {
        await fetch(`/api/schedules/${scheduleToDelete.id}`, { method: 'DELETE' })
        setSchedules(prev => prev.filter(s => s.id !== scheduleToDelete.id))
        toast({
          title: 'ลบสำเร็จ',
          description: `ลบตารางเรียน "${scheduleToDelete.subject}" เรียบร้อยแล้ว`,
        })
      } catch (error) {
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: 'ไม่สามารถลบตารางเรียนได้',
          variant: 'destructive'
        })
      } finally {
        setScheduleToDelete(null)
        setIsDeleteDialogOpen(false)
      }
    }
  }

  const handleSave = async () => {
    if (!editingSchedule) return

    if (!editingSchedule.subject || !editingSchedule.teacher || !editingSchedule.room || 
        !editingSchedule.startTime || !editingSchedule.endTime || !editingSchedule.day) {
      toast({
        title: 'ข้อมูลไม่ครบ',
        description: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        variant: 'destructive'
      })
      return
    }

    const isNew = editingSchedule.id?.startsWith('new-')
    
    try {
      if (isNew) {
        const res = await fetch('/api/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingSchedule)
        })
        const newSchedule = await res.json()
        setSchedules(prev => [...prev, newSchedule])
        toast({
          title: 'เพิ่มสำเร็จ',
          description: `เพิ่มตารางเรียน "${newSchedule.subject}" เรียบร้อยแล้ว`,
        })
      } else {
        toast({
          title: 'ฟีเจอร์ยังไม่สมบูรณ์',
          description: `ระบบแก้ไขยังไม่ได้ถูกติดตั้งเต็มรูปแบบใน API`,
        })
      }
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถบันทึกตารางเรียนได้',
        variant: 'destructive'
      })
    }

    setIsDialogOpen(false)
    setEditingSchedule(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarCog className="w-7 h-7 text-orange-500" />
            จัดการตารางเรียน
          </h1>
          <p className="text-muted-foreground mt-1">เพิ่ม แก้ไข หรือลบตารางเรียน</p>
        </div>
        <Button onClick={handleAddNew} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-5 h-5 mr-2" />
          เพิ่มตารางเรียน
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ค้นหาวิชา, ครูผู้สอน, ห้องเรียน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDay} onValueChange={setFilterDay}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="เลือกวัน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกวัน</SelectItem>
                {days.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการตารางเรียน</CardTitle>
          <CardDescription>ทั้งหมด {filteredSchedules.length} รายการ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>สี</TableHead>
                  <TableHead>วิชา</TableHead>
                  <TableHead>ครูผู้สอน</TableHead>
                  <TableHead>ห้อง</TableHead>
                  <TableHead>วัน</TableHead>
                  <TableHead>เวลา</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      ไม่พบข้อมูลตารางเรียน
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div className={cn('w-6 h-6 rounded-full', schedule.color)} />
                      </TableCell>
                      <TableCell className="font-medium">{schedule.subject}</TableCell>
                      <TableCell>{schedule.teacher}</TableCell>
                      <TableCell>{schedule.room}</TableCell>
                      <TableCell>{schedule.day}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <Clock className="w-4 h-4" />
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(schedule)}
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(schedule)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule?.id?.startsWith('new-') ? 'เพิ่มตารางเรียน' : 'แก้ไขตารางเรียน'}
            </DialogTitle>
            <DialogDescription>
              กรอกข้อมูลตารางเรียนให้ครบถ้วน
            </DialogDescription>
          </DialogHeader>

          {editingSchedule && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>วิชา</Label>
                <Input
                  placeholder="เช่น คณิตศาสตร์"
                  value={editingSchedule.subject || ''}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>ครูผู้สอน</Label>
                <Input
                  placeholder="เช่น อ.สมศรี"
                  value={editingSchedule.teacher || ''}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, teacher: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>ห้องเรียน</Label>
                <Input
                  placeholder="เช่น 301"
                  value={editingSchedule.room || ''}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, room: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>วัน</Label>
                <Select
                  value={editingSchedule.day}
                  onValueChange={(value) => setEditingSchedule({ ...editingSchedule, day: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกวัน" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>เวลาเริ่ม</Label>
                  <Input
                    type="time"
                    value={editingSchedule.startTime || ''}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>เวลาสิ้นสุด</Label>
                  <Input
                    type="time"
                    value={editingSchedule.endTime || ''}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>สี</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setEditingSchedule({ ...editingSchedule, color: color.value })}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        color.value,
                        editingSchedule.color === color.value 
                          ? 'ring-2 ring-offset-2 ring-foreground scale-110' 
                          : 'hover:scale-110'
                      )}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
              <Save className="w-4 h-4 mr-2" />
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบตารางเรียน &quot;{scheduleToDelete?.subject}&quot; วัน{scheduleToDelete?.day} หรือไม่?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              ลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
