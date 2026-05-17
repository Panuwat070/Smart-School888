'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Search,
  Save,
  Image as ImageIcon
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
import type { Book } from '@/lib/types'
import Image from 'next/image'

export default function AdminBooksPage() {
  const { toast } = useToast()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  
  // Form states
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    subject: '',
    author: '',
    description: '',
    pdfUrl: '',
    coverImage: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fetchBooks = () => {
    setIsLoading(true)
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddNew = () => {
    setNewBook({
      title: '',
      subject: '',
      author: '',
      description: '',
      pdfUrl: '',
      coverImage: ''
    })
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (bookToDelete) {
      try {
        const res = await fetch(`/api/books/${bookToDelete.id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete book')
        
        setBooks(prev => prev.filter(b => b.id !== bookToDelete.id))
        toast({
          title: 'ลบสำเร็จ',
          description: `ลบหนังสือ "${bookToDelete.title}" เรียบร้อยแล้ว`,
        })
      } catch (error) {
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: 'ไม่สามารถลบหนังสือได้',
          variant: 'destructive'
        })
      } finally {
        setBookToDelete(null)
        setIsDeleteDialogOpen(false)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    if (!newBook.title || !newBook.subject || !newBook.author) {
      toast({
        title: 'ข้อมูลไม่ครบ',
        description: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ (ชื่อหนังสือ, วิชา, ผู้แต่ง)',
        variant: 'destructive'
      })
      return
    }

    setIsSaving(true)

    try {
      let coverImageUrl = newBook.coverImage

      // Upload file if selected
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          coverImageUrl = uploadData.url
        } else {
          throw new Error('Upload failed')
        }
      }

      // Create book record
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBook, coverImage: coverImageUrl })
      })

      if (!res.ok) throw new Error('Failed to create book')

      const createdBook = await res.json()
      setBooks(prev => [createdBook, ...prev])
      
      toast({
        title: 'เพิ่มสำเร็จ',
        description: `เพิ่มหนังสือ "${createdBook.title}" เรียบร้อยแล้ว`,
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error(error)
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถบันทึกข้อมูลหนังสือได้',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-orange-500" />
            จัดการหนังสือเรียน
          </h1>
          <p className="text-muted-foreground mt-1">เพิ่ม แก้ไข หรือลบข้อมูลหนังสือ</p>
        </div>
        <Button onClick={handleAddNew} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-5 h-5 mr-2" />
          เพิ่มหนังสือ
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ค้นหาชื่อหนังสือ, วิชา, หรือผู้แต่ง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการหนังสือ</CardTitle>
          <CardDescription>ทั้งหมด {filteredBooks.length} รายการ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ปก</TableHead>
                  <TableHead>ชื่อหนังสือ</TableHead>
                  <TableHead>วิชา</TableHead>
                  <TableHead>ผู้แต่ง</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      กำลังโหลดข้อมูล...
                    </TableCell>
                  </TableRow>
                ) : filteredBooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      ไม่พบข้อมูลหนังสือ
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <div className="w-12 h-16 bg-secondary/50 rounded overflow-hidden relative flex items-center justify-center">
                          {book.coverImage ? (
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-muted-foreground opacity-50" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{book.title}</TableCell>
                      <TableCell>{book.subject}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(book)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>เพิ่มหนังสือเรียน</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลและอัพโหลดรูปปกหนังสือ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>รูปภาพปก</Label>
              <div 
                className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="relative w-32 h-40">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">คลิกเพื่ออัพโหลดรูปภาพ</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>ชื่อหนังสือ <span className="text-destructive">*</span></Label>
              <Input
                placeholder="เช่น คณิตศาสตร์ ม.6 เล่ม 1"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>วิชา <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="เช่น คณิตศาสตร์"
                  value={newBook.subject}
                  onChange={(e) => setNewBook({ ...newBook, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>ผู้แต่ง/สำนักพิมพ์ <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="เช่น สสวท."
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>รายละเอียดเพิ่มเติม</Label>
              <Textarea
                placeholder="รายละเอียดของหนังสือเล่มนี้..."
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={isSaving}>
              {isSaving ? 'กำลังบันทึก...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  บันทึก
                </>
              )}
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
              คุณต้องการลบหนังสือ &quot;{bookToDelete?.title}&quot; หรือไม่?
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
