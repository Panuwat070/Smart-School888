'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  DoorOpen,
  BookOpen,
  Megaphone,
  User,
  LogOut,
  ChevronLeft,
  GraduationCap,
  Menu,
  Settings,
  CalendarCog,
  DoorClosed,
  Bell,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const studentMenuItems = [
  { icon: LayoutDashboard, label: 'แดชบอร์ด', href: '/dashboard' },
  { icon: Calendar, label: 'ตารางเรียน', href: '/dashboard/schedule' },
  { icon: DoorOpen, label: 'ห้องว่าง', href: '/dashboard/rooms' },
  { icon: BookOpen, label: 'หนังสือเรียน', href: '/dashboard/books' },
  { icon: Megaphone, label: 'ประกาศ', href: '/dashboard/announcements' },
  { icon: User, label: 'โปรไฟล์', href: '/dashboard/profile' },
]

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'แดชบอร์ด', href: '/dashboard' },
  { icon: CalendarCog, label: 'จัดการตารางเรียน', href: '/dashboard/admin/schedules' },
  { icon: DoorClosed, label: 'จัดการห้องเรียน', href: '/dashboard/admin/rooms' },
  { icon: Bell, label: 'จัดการประกาศ', href: '/dashboard/admin/announcements' },
  { icon: User, label: 'โปรไฟล์', href: '/dashboard/profile' },
]

interface SidebarProps {
  onMobileClose?: () => void
  isMobileOpen?: boolean
}

export function Sidebar({ onMobileClose, isMobileOpen }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student')

  useEffect(() => {
    const savedUser = localStorage.getItem('school_user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUserRole(user.role || 'student')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('school_user')
    window.location.href = '/'
  }

  const menuItems = userRole === 'admin' ? adminMenuItems : studentMenuItems

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-card border-r border-border shadow-lg transition-all duration-300 flex flex-col',
          isCollapsed ? 'w-20' : 'w-64',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'gap-3')}>
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              userRole === 'admin' 
                ? 'bg-gradient-to-br from-orange-500 to-red-500'
                : 'bg-gradient-to-br from-primary to-accent'
            )}>
              {userRole === 'admin' ? (
                <Shield className="w-6 h-6 text-white" />
              ) : (
                <GraduationCap className="w-6 h-6 text-white" />
              )}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-foreground truncate">Smart School</h1>
                <p className="text-xs text-muted-foreground truncate">
                  {userRole === 'admin' ? 'ระบบผู้ดูแล' : 'ระบบจัดการโรงเรียน'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Role Badge */}
        {!isCollapsed && (
          <div className="px-4 py-2">
            <div className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium text-center',
              userRole === 'admin'
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            )}>
              {userRole === 'admin' ? 'ผู้ดูแลระบบ' : 'นักเรียน'}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                  isCollapsed && 'justify-center',
                  isActive
                    ? userRole === 'admin'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-white')} />
                {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-2">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              'w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10',
              isCollapsed ? 'justify-center px-0' : 'justify-start'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">ออกจากระบบ</span>}
          </Button>

          {/* Collapse button - desktop only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full justify-center text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className={cn('w-5 h-5 transition-transform', isCollapsed && 'rotate-180')} />
          </Button>
        </div>
      </aside>
    </>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="lg:hidden"
    >
      <Menu className="w-6 h-6" />
    </Button>
  )
}
