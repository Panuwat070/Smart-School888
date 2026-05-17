'use client'

import { useState, useEffect } from 'react'
import { Bell, Moon, Sun, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import type { Announcement } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MobileMenuButton } from './sidebar'

interface TopbarProps {
  onMobileMenuClick: () => void
}

export function Topbar({ onMobileMenuClick }: TopbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showSearch, setShowSearch] = useState(false)
  const [user, setUser] = useState<{ name: string; classroom: string } | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  
  // For demo, we just use the first 2 as unread if any exist
  const unreadCount = Math.min(announcements.length, 2)

  useEffect(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('school_theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', prefersDark)
    }

    // Get user from localStorage
    const savedUser = localStorage.getItem('school_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Fetch real announcements
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAnnouncements(data)
        }
      })
      .catch(console.error)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('school_theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <MobileMenuButton onClick={onMobileMenuClick} />
          
          {/* Search - Desktop */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา..."
              className="w-64 pl-10 bg-secondary/50 border-transparent focus:border-primary"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden"
          >
            {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>ประกาศล่าสุด</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    ใหม่
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {announcements.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">ไม่มีประกาศใหม่</div>
              )}
              {announcements.slice(0, 5).map((announcement, index) => (
                <DropdownMenuItem
                  key={announcement.id}
                  className={cn(
                    'flex flex-col items-start gap-1 p-3 cursor-pointer',
                    index < unreadCount && 'bg-primary/5'
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        announcement.type === 'holiday' && 'bg-destructive',
                        announcement.type === 'news' && 'bg-warning',
                        announcement.type === 'event' && 'bg-success',
                        (!['holiday', 'news', 'event'].includes(announcement.type)) && 'bg-primary'
                      )}
                    />
                    <span className="font-medium text-sm truncate flex-1">{announcement.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 pl-4">
                    {announcement.content}
                  </p>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-primary justify-center">
                ดูทั้งหมด
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground">{user?.name || 'ผู้ใช้'}</p>
                  <p className="text-xs text-muted-foreground">{user?.classroom || '-'}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>โปรไฟล์</DropdownMenuItem>
              <DropdownMenuItem>ตั้งค่า</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  localStorage.removeItem('school_user')
                  window.location.href = '/'
                }}
              >
                ออกจากระบบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="md:hidden absolute top-16 left-0 right-0 p-4 bg-card border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา..."
              className="w-full pl-10 bg-secondary/50"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
