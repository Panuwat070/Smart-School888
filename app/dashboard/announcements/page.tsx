'use client'

import { useState, useEffect, useMemo } from 'react'
import { Megaphone, Search, Calendar, User, Filter, ImageIcon } from 'lucide-react'
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
import type { Announcement } from '@/lib/types'
import { cn } from '@/lib/utils'

const typeLabels = {
  news: { label: 'ข่าว', color: 'bg-warning/10 text-warning border-warning/30' },
  holiday: { label: 'วันหยุด', color: 'bg-destructive/10 text-destructive border-destructive/30' },
  event: { label: 'กิจกรรม', color: 'bg-primary/10 text-primary border-primary/30' },
}

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

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

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      const matchesSearch = 
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === 'all' || announcement.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [searchQuery, typeFilter, announcements])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-primary" />
          ประกาศ
        </h1>
        <p className="text-muted-foreground mt-1">ข่าวสารและประกาศจากโรงเรียน</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {announcements.filter(a => a.type === 'news').length}
              </p>
              <p className="text-sm text-muted-foreground">ข่าว</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {announcements.filter(a => a.type === 'holiday').length}
              </p>
              <p className="text-sm text-muted-foreground">วันหยุด</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {announcements.filter(a => a.type === 'event').length}
              </p>
              <p className="text-sm text-muted-foreground">กิจกรรม</p>
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
                placeholder="ค้นหาประกาศ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="ประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกประเภท</SelectItem>
                <SelectItem value="news">ข่าว</SelectItem>
                <SelectItem value="holiday">วันหยุด</SelectItem>
                <SelectItem value="event">กิจกรรม</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card
            key={announcement.id}
            className="overflow-hidden transition-all hover:shadow-lg cursor-pointer"
            onClick={() => setSelectedAnnouncement(announcement)}
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Image placeholder */}
                {announcement.image && (
                  <div className="md:w-48 h-32 md:h-auto bg-secondary flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-1 p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={cn('text-xs', typeLabels[announcement.type].color)}
                    >
                      {typeLabels[announcement.type].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatShortDate(announcement.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{announcement.title}</h3>
                  <p className="text-muted-foreground line-clamp-2">{announcement.content}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{announcement.author}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">ไม่พบประกาศที่ตรงกับการค้นหา</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setTypeFilter('all')
              }}
            >
              ล้างตัวกรอง
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Announcement Detail Dialog */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  selectedAnnouncement && typeLabels[selectedAnnouncement.type].color
                )}
              >
                {selectedAnnouncement && typeLabels[selectedAnnouncement.type].label}
              </Badge>
            </div>
            <DialogTitle className="text-xl">{selectedAnnouncement?.title}</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedAnnouncement.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedAnnouncement.author}
                </span>
              </div>

              {selectedAnnouncement.image && (
                <div className="w-full h-48 bg-secondary rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
              )}

              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
