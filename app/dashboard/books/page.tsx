'use client'

import { useState, useMemo, useEffect } from 'react'
import { BookOpen, Search, Download, Eye, Filter, BookMarked } from 'lucide-react'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { subjects } from '@/lib/mock-data'
import type { Book } from '@/lib/types'
import { cn } from '@/lib/utils'

// Placeholder cover colors for books
const coverColors = [
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-emerald-700',
  'from-purple-500 to-purple-700',
  'from-orange-500 to-orange-700',
  'from-rose-500 to-rose-700',
  'from-cyan-500 to-cyan-700',
  'from-indigo-500 to-indigo-700',
  'from-teal-500 to-teal-700',
]

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
  }, [])

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSubject = selectedSubject === 'all' || book.subject === selectedSubject
      return matchesSearch && matchesSubject
    })
  }, [searchQuery, selectedSubject, books])

  const uniqueSubjects = [...new Set(books.map(b => b.subject))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          หนังสือเรียน
        </h1>
        <p className="text-muted-foreground mt-1">อ่านและดาวน์โหลดหนังสือเรียนออนไลน์</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{books.length}</p>
              <p className="text-sm text-muted-foreground">หนังสือทั้งหมด</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <BookMarked className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{uniqueSubjects.length}</p>
              <p className="text-sm text-muted-foreground">หมวดหมู่</p>
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
                placeholder="ค้นหาหนังสือ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="เลือกวิชา" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกวิชา</SelectItem>
                {uniqueSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book, index) => (
          <Card
            key={book.id}
            className="overflow-hidden transition-all hover:shadow-xl cursor-pointer group"
            onClick={() => setSelectedBook(book)}
          >
            {/* Book Cover */}
            <div
              className={cn(
                'aspect-[3/4] relative flex items-center justify-center p-6',
                book.coverImage ? 'bg-secondary/50' : 'bg-gradient-to-br ' + coverColors[index % coverColors.length]
              )}
            >
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="absolute inset-0 w-full h-full object-cover opacity-90" />
              ) : (
                <div className="text-white text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-3 opacity-80" />
                  <p className="font-bold text-lg leading-tight">{book.title}</p>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button size="sm" variant="secondary" className="gap-2">
                  <Eye className="w-4 h-4" />
                  อ่าน
                </Button>
                <Button size="sm" variant="secondary" className="gap-2">
                  <Download className="w-4 h-4" />
                  ดาวน์โหลด
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <Badge variant="secondary" className="mb-2 text-xs">{book.subject}</Badge>
              <h3 className="font-semibold text-foreground line-clamp-2">{book.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">ไม่พบหนังสือที่ตรงกับการค้นหา</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setSelectedSubject('all')
              }}
            >
              ล้างตัวกรอง
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Book Detail Dialog */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div
                className={cn(
                  'aspect-[3/4] max-h-64 mx-auto rounded-lg flex items-center justify-center p-6 relative overflow-hidden',
                  selectedBook.coverImage ? 'bg-secondary/50' : 'bg-gradient-to-br ' + coverColors[books.findIndex(b => b.id === selectedBook.id) % coverColors.length]
                )}
              >
                {selectedBook.coverImage ? (
                  <img src={selectedBook.coverImage} alt={selectedBook.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="text-white text-center">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-80" />
                    <p className="font-bold leading-tight">{selectedBook.title}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">หมวดหมู่</p>
                  <Badge variant="secondary">{selectedBook.subject}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ผู้แต่ง</p>
                  <p className="font-medium">{selectedBook.author}</p>
                </div>
                {selectedBook.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">รายละเอียด</p>
                    <p className="text-sm">{selectedBook.description}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 gap-2">
                  <Eye className="w-4 h-4" />
                  อ่านหนังสือ
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  ดาวน์โหลด PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
