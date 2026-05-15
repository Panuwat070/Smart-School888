'use client'

import { useState, useEffect } from 'react'
import { 
  DoorClosed, 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Save,
  Users,
  Building2
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
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { buildings } from '@/lib/mock-data'
import type { Room } from '@/lib/types'
import { cn } from '@/lib/utils'

const emptyRoom: Partial<Room> = {
  name: '',
  building: '',
  capacity: 30,
  status: 'available'
}

export default function AdminRoomsPage() {
  const { toast } = useToast()
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBuilding, setFilterBuilding] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBuilding = filterBuilding === 'all' || room.building === filterBuilding
    return matchesSearch && matchesBuilding
  })

  const handleAddNew = () => {
    setEditingRoom({ ...emptyRoom, id: `new-${Date.now()}` })
    setIsDialogOpen(true)
  }

  const handleEdit = (room: Room) => {
    setEditingRoom({ ...room })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (roomToDelete) {
      try {
        await fetch(`/api/rooms/${roomToDelete.id}`, { method: 'DELETE' })
        setRooms(prev => prev.filter(r => r.id !== roomToDelete.id))
        toast({
          title: 'ลบสำเร็จ',
          description: `ลบห้อง "${roomToDelete.name}" เรียบร้อยแล้ว`,
        })
      } catch (error) {
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: 'ไม่สามารถลบห้องได้',
          variant: 'destructive'
        })
      } finally {
        setRoomToDelete(null)
        setIsDeleteDialogOpen(false)
      }
    }
  }

  const handleSave = async () => {
    if (!editingRoom) return

    if (!editingRoom.name || !editingRoom.building || !editingRoom.capacity) {
      toast({
        title: 'ข้อมูลไม่ครบ',
        description: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        variant: 'destructive'
      })
      return
    }

    const isNew = editingRoom.id?.startsWith('new-')
    
    try {
      if (isNew) {
        const res = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingRoom)
        })
        const newRoom = await res.json()
        setRooms(prev => [...prev, newRoom])
        toast({
          title: 'เพิ่มสำเร็จ',
          description: `เพิ่มห้อง "${newRoom.name}" เรียบร้อยแล้ว`,
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
        description: 'ไม่สามารถบันทึกข้อมูลห้องได้',
        variant: 'destructive'
      })
    }

    setIsDialogOpen(false)
    setEditingRoom(null)
  }

  const availableCount = rooms.filter(r => r.status === 'available').length
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <DoorClosed className="w-7 h-7 text-orange-500" />
            จัดการห้องเรียน
          </h1>
          <p className="text-muted-foreground mt-1">เพิ่ม แก้ไข หรือลบห้องเรียน</p>
        </div>
        <Button onClick={handleAddNew} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-5 h-5 mr-2" />
          เพิ่มห้องเรียน
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ห้องทั้งหมด</p>
                <p className="text-2xl font-bold">{rooms.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ห้องว่าง</p>
                <p className="text-2xl font-bold text-emerald-500">{availableCount}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <DoorClosed className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">กำลังใช้งาน</p>
                <p className="text-2xl font-bold text-orange-500">{occupiedCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ค้นหาห้อง, อาคาร..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBuilding} onValueChange={setFilterBuilding}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="เลือกอาคาร" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกอาคาร</SelectItem>
                {buildings.map(building => (
                  <SelectItem key={building} value={building}>{building}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการห้องเรียน</CardTitle>
          <CardDescription>ทั้งหมด {filteredRooms.length} ห้อง</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อห้อง</TableHead>
                  <TableHead>อาคาร</TableHead>
                  <TableHead>ความจุ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>รายละเอียด</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      ไม่พบข้อมูลห้องเรียน
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.building}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {room.capacity} คน
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={room.status === 'available' ? 'default' : 'secondary'}
                          className={cn(
                            room.status === 'available' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          )}
                        >
                          {room.status === 'available' ? 'ว่าง' : 'ไม่ว่าง'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {room.currentSubject && (
                          <span>{room.currentSubject} (ถึง {room.occupiedUntil})</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(room)}
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(room)}
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
              {editingRoom?.id?.startsWith('new-') ? 'เพิ่มห้องเรียน' : 'แก้ไขห้องเรียน'}
            </DialogTitle>
            <DialogDescription>
              กรอกข้อมูลห้องเรียนให้ครบถ้วน
            </DialogDescription>
          </DialogHeader>

          {editingRoom && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ชื่อห้อง</Label>
                <Input
                  placeholder="เช่น 301, ห้องคอม 1"
                  value={editingRoom.name || ''}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>อาคาร</Label>
                <Select
                  value={editingRoom.building}
                  onValueChange={(value) => setEditingRoom({ ...editingRoom, building: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกอาคาร" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map(building => (
                      <SelectItem key={building} value={building}>{building}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ความจุ (คน)</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="30"
                  value={editingRoom.capacity || ''}
                  onChange={(e) => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label>สถานะ</Label>
                <Select
                  value={editingRoom.status}
                  onValueChange={(value: 'available' | 'occupied') => setEditingRoom({ ...editingRoom, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">ว่าง</SelectItem>
                    <SelectItem value="occupied">ไม่ว่าง</SelectItem>
                  </SelectContent>
                </Select>
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
              คุณต้องการลบห้อง &quot;{roomToDelete?.name}&quot; หรือไม่?
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
