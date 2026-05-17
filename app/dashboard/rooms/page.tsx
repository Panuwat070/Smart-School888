'use client'

import { useState, useEffect, useMemo } from 'react'
import { DoorOpen, Search, Users, Clock, Building, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { buildings } from '@/lib/mock-data'
import type { Room } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

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

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBuilding = selectedBuilding === 'all' || room.building === selectedBuilding
      const matchesStatus = statusFilter === 'all' || room.status === statusFilter
      return matchesSearch && matchesBuilding && matchesStatus
    })
  }, [searchQuery, selectedBuilding, statusFilter, rooms])

  const availableCount = rooms.filter(r => r.status === 'available').length
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <DoorOpen className="w-8 h-8 text-primary" />
          ห้องว่าง
        </h1>
        <p className="text-muted-foreground mt-1">ตรวจสอบสถานะห้องเรียนและห้องพิเศษ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <DoorOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{rooms.length}</p>
              <p className="text-sm text-muted-foreground">ห้องทั้งหมด</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <DoorOpen className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{availableCount}</p>
              <p className="text-sm text-muted-foreground">ห้องว่าง</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <DoorOpen className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{occupiedCount}</p>
              <p className="text-sm text-muted-foreground">กำลังใช้งาน</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{buildings.length}</p>
              <p className="text-sm text-muted-foreground">อาคาร</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาห้อง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="w-full sm:w-48">
                <Building className="w-4 h-4 mr-2" />
                <SelectValue placeholder="เลือกอาคาร" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกอาคาร</SelectItem>
                {buildings.map((building) => (
                  <SelectItem key={building} value={building}>{building}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="available">ว่าง</SelectItem>
                <SelectItem value="occupied">กำลังใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Room Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            className={cn(
              'overflow-hidden transition-all hover:shadow-lg cursor-pointer group',
              room.status === 'available'
                ? 'hover:border-success/50'
                : 'hover:border-destructive/50'
            )}
          >
            <div
              className={cn(
                'h-2',
                room.status === 'available' ? 'bg-success' : 'bg-destructive'
              )}
            />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">ห้อง {room.name}</CardTitle>
                <Badge
                  variant={room.status === 'available' ? 'default' : 'destructive'}
                  className={cn(
                    room.status === 'available'
                      ? 'bg-success text-success-foreground'
                      : 'bg-destructive text-destructive-foreground'
                  )}
                >
                  {room.status === 'available' ? 'ว่าง' : 'ไม่ว่าง'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                {room.building}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                ความจุ {room.capacity} คน
              </div>
              
              {room.status === 'occupied' && (
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">กำลังใช้: </span>
                    <span className="font-medium text-foreground">{room.currentSubject}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      ว่างเวลา {room.occupiedUntil} น.
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {room.occupiedBy} คน
                    </span>
                  </div>
                </div>
              )}

              {room.status === 'available' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-2 bg-success hover:bg-success/90 text-success-foreground">
                      จองห้อง
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>จองห้อง {room.name}</DialogTitle>
                      <DialogDescription>
                        กรอกข้อมูลเพื่อทำการจองห้อง {room.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                          หัวข้อ/วิชา
                        </Label>
                        <Input
                          id="subject"
                          placeholder="เช่น ติวคณิตศาสตร์"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          เวลาสิ้นสุด
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="people" className="text-right">
                          จำนวนคน
                        </Label>
                        <Input
                          id="people"
                          type="number"
                          placeholder="จำนวนคน"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" onClick={() => alert(`จองห้อง ${room.name} สำเร็จแล้ว!`)}>
                          ยืนยันการจอง
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <DoorOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">ไม่พบห้องที่ตรงกับการค้นหา</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setSelectedBuilding('all')
                setStatusFilter('all')
              }}
            >
              ล้างตัวกรอง
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
