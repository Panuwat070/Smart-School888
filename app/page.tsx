'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, GraduationCap, Loader2, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type UserRole = 'student' | 'admin'

const demoCredentials = {
  student: {
    id: '65010001',
    password: 'student123',
    name: 'สมชาย ใจดี',
    classroom: 'ม.6/1'
  },
  admin: {
    id: 'admin',
    password: 'admin123',
    name: 'ผู้ดูแลระบบ',
    classroom: '-'
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<UserRole>('student')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userId || !password) {
      setError(role === 'admin' ? 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' : 'กรุณากรอกรหัสนักเรียนและรหัสผ่าน')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, role })
      })

      if (!res.ok) {
        throw new Error('Invalid credentials')
      }

      const userData = await res.json()

      localStorage.setItem('school_user', JSON.stringify(userData))
      router.push('/dashboard')
    } catch (err) {
      setError(role === 'admin' ? 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' : 'รหัสนักเรียนหรือรหัสผ่านไม่ถูกต้อง')
    }

    setIsLoading(false)
  }

  const fillDemoCredentials = () => {
    const demo = demoCredentials[role]
    setUserId(demo.id)
    setPassword(demo.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative glass shadow-xl border-white/20 dark:border-white/10">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Smart School</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              ระบบจัดการโรงเรียนอัจฉริยะ
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* Role Selector */}
          <div className="mb-6">
            <Label className="text-foreground mb-3 block">เลือกประเภทผู้ใช้</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRole('student')
                  setUserId('')
                  setPassword('')
                  setError('')
                }}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                  role === 'student'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white/50 dark:bg-slate-800/50 text-muted-foreground hover:border-primary/50'
                )}
              >
                <User className="w-8 h-8" />
                <span className="font-medium">นักเรียน</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('admin')
                  setUserId('')
                  setPassword('')
                  setError('')
                }}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                  role === 'admin'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white/50 dark:bg-slate-800/50 text-muted-foreground hover:border-primary/50'
                )}
              >
                <Shield className="w-8 h-8" />
                <span className="font-medium">ผู้ดูแลระบบ</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-foreground">
                {role === 'admin' ? 'ชื่อผู้ใช้' : 'รหัสนักเรียน / อีเมล'}
              </Label>
              <Input
                id="userId"
                type="text"
                placeholder={role === 'admin' ? 'admin' : '65010001'}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="h-12 bg-white/50 dark:bg-slate-800/50 border-border focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">รหัสผ่าน</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12 bg-white/50 dark:bg-slate-800/50 border-border focus:border-primary transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  จำรหัสผ่าน
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
            <p className="text-sm text-muted-foreground text-center mb-2">
              ทดลองใช้งานด้วยบัญชี Demo
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={fillDemoCredentials}
              className="w-full"
              disabled={isLoading}
            >
              {role === 'admin' ? 'ใช้บัญชี Admin Demo' : 'ใช้บัญชีนักเรียน Demo'}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {role === 'admin'
                ? 'ID: admin / Password: admin123'
                : 'ID: 65010001 / Password: student123'
              }
            </p>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>ยังไม่มีบัญชี? <button className="text-primary hover:underline">ติดต่อฝ่ายทะเบียน</button></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
