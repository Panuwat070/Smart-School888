'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Save,
  Calendar,
  Newspaper,
  CalendarHeart,
  PartyPopper,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import type { Announcement } from '@/lib/types'
import { cn } from '@/lib/utils'

const typeOptions = [
  { value: 'news', label: 'ข่าวสาร', icon: Newspaper, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'holiday', label: 'วันหยุด', icon: CalendarHeart, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'event', label: 'กิจกรรม', icon: PartyPopper, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
]

const emptyAnnouncement: Partial<Announcement> = {
  title: '',
  content: '',
  type: 'news',
  author: 'ผู้ดูแลระบบ'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function AdminAnnouncementsPage() {
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<Announcement> | null>(null)
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null)
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || announcement.type === filterType
    return matchesSearch && matchesType
  })

  const handleAddNew = () => {
    setEditingAnnouncement({ ...emptyAnnouncement, id: `new-${Date.now()}` })
    setIsDialogOpen(true)
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement({ ...announcement })
    setIsDialogOpen(true)
  }

  const handleView = (announcement: Announcement) => {
    setViewingAnnouncement(announcement)
    setIsViewDialogOpen(true)
  }

  const handleDeleteClick = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (announcementToDelete) {
      try {
        await fetch(`/api/announcements/${announcementToDelete.id}`, { method: 'DELETE' })
        setAnnouncements(prev => prev.filter(a => a.id !== announcementToDelete.id))
        toast({
          title: 'ลบสำเร็จ',
          description: `ลบประกาศ "${announcementToDelete.title}" เรียบร้อยแล้ว`,
        })
      } catch (error) {
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: 'ไม่สามารถลบประกาศได้',
          variant: 'destructive'
        })
      } finally {
        setAnnouncementToDelete(null)
        setIsDeleteDialogOpen(false)
      }
    }
  }

  const handleSave = async () => {
    if (!editingAnnouncement) return

    if (!editingAnnouncement.title || !editingAnnouncement.content || !editingAnnouncement.type) {
      toast({
        title: 'ข้อมูลไม่ครบ',
        description: 'กรุณากรอกหัวข้อและเนื้อหาประกาศ',
        variant: 'destructive'
      })
      return
    }

    const isNew = editingAnnouncement.id?.startsWith('new-')
    
    try {
      if (isNew) {
        const res = await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingAnnouncement)
        })
        const newAnnouncement = await res.json()
        setAnnouncements(prev => [newAnnouncement, ...prev])
        toast({
          title: 'เพิ่มสำเร็จ',
          description: `เพิ่มประกาศ "${newAnnouncement.title}" เรียบร้อยแล้ว`,
        })
      } else {
        // Here we could implement a PUT request to update, but for now we skip edit api implementation
        // and just show success if they try to edit
        toast({
          title: 'ฟีเจอร์ยังไม่สมบูรณ์',
          description: `ระบบแก้ไขยังไม่ได้ถูกติดตั้งเต็มรูปแบบใน API`,
        })
      }
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถบันทึกประกาศได้',
        variant: 'destructive'
      })
    }

    setIsDialogOpen(false)
    setEditingAnnouncement(null)
  }

  const getTypeInfo = (type: string) => {
    return typeOptions.find(t => t.value === type) || typeOptions[0]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-7 h-7 text-orange-500" />
            จัดการประกาศ
          </h1>
          <p className="text-muted-foreground mt-1">เพิ่ม แก้ไข หรือลบประกาศ</p>
        </div>
        <Button onClick={handleAddNew} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-5 h-5 mr-2" />
          เพิ่มประกาศ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ประกาศทั้งหมด</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        {typeOptions.map(type => {
          const count = announcements.filter(a => a.type === type.value).length
          return (
            <Card key={type.value}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{type.label}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', type.color.split(' ')[0])}>
                    <type.icon className={cn('w-6 h-6', type.color.split(' ')[1])} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ค้นหาประกาศ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="เลือกประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกประเภท</SelectItem>
                {typeOptions.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการประกาศ</CardTitle>
          <CardDescription>ทั้งหมด {filteredAnnouncements.length} รายการ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>หัวข้อ</TableHead>
                  <TableHead>ผู้เขียน</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnouncements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      ไม่พบประกาศ
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAnnouncements.map((announcement) => {
                    const typeInfo = getTypeInfo(announcement.type)
                    return (
                      <TableRow key={announcement.id}>
                        <TableCell>
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium max-w-xs truncate">
                          {announcement.title}
                        </TableCell>
                        <TableCell>{announcement.author}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDate(announcement.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(announcement)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(announcement)}
                              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(announcement)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement?.id?.startsWith('new-') ? 'เพิ่มประกาศ' : 'แก้ไขประกาศ'}
            </DialogTitle>
            <DialogDescription>
              กรอกข้อมูลประกาศให้ครบถ้วน
            </DialogDescription>
          </DialogHeader>

          {editingAnnouncement && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ประเภท</Label>
                <Select
                  value={editingAnnouncement.type}
                  onValueChange={(value: 'news' | 'holiday' | 'event') => 
                    setEditingAnnouncement({ ...editingAnnouncement, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>หัวข้อ</Label>
                <Input
                  placeholder="หัวข้อประกาศ"
                  value={editingAnnouncement.title || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>เนื้อหา</Label>
                <Textarea
                  placeholder="รายละเอียดประกาศ..."
                  rows={6}
                  value={editingAnnouncement.content || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                />
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewingAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              {viewingAnnouncement && (
                <span className="flex items-center gap-2 mt-2">
                  <Badge className={getTypeInfo(viewingAnnouncement.type).color}>
                    {getTypeInfo(viewingAnnouncement.type).label}
                  </Badge>
                  <span className="text-muted-foreground">
                    โดย {viewingAnnouncement.author} | {formatDate(viewingAnnouncement.createdAt)}
                  </span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {viewingAnnouncement?.content}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              ปิด
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
              คุณต้องการลบประกาศ &quot;{announcementToDelete?.title}&quot; หรือไม่?
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
