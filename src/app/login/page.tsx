'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TrendingUp, Zap, Shield, BarChart3, PiggyBank, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
          </div>
          <p className="mt-6 text-white/80 font-medium">Initializing your financial hub...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-40" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.02%27%3E%3Ccircle cx=%2730%27 cy=%2730%27 r=%271%27%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  FinanceFlow
                </h1>
                <p className="text-white/60 text-sm">Smart Financial Intelligence</p>
              </div>
            </div>
          </div>

          {/* Value proposition */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-white leading-tight mb-6">
                Your Money,
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Supercharged
                </span>
              </h2>
              <p className="text-xl text-white/70 leading-relaxed max-w-lg">
                Transform your financial future with AI-powered insights, real-time analytics, and intelligent automation.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 max-w-md">
              <div className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Lightning Fast</h3>
                  <p className="text-white/60 text-sm">Instant transaction tracking and real-time updates</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Smart Analytics</h3>
                  <p className="text-white/60 text-sm">AI-driven insights to optimize your spending</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Bank-Grade Security</h3>
                  <p className="text-white/60 text-sm">Your data is encrypted and completely secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Authentication */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-12">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                FinanceFlow
              </h1>
              <p className="text-white/60">Smart Financial Intelligence</p>
            </div>

            {/* Auth card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Welcome Back
                </h2>
                <p className="text-white/70 text-lg">
                  Sign in to access your financial command center
                </p>
              </div>

              <div className="space-y-6">
                {/* Google Sign In Button */}
                <Button
                  onClick={signInWithGoogle}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-lg rounded-2xl border-0 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="relative">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <span>Continue with Google</span>
                  </div>
                  
                  {/* Hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 ${isHovered ? 'from-blue-600/10 via-purple-600/10 to-pink-600/10' : ''} transition-all duration-300 rounded-2xl`}></div>
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-white/60 font-medium">Secure & Encrypted</span>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-white/20 transition-colors">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-white/70 text-xs font-medium">Secure</p>
                  </div>
                  <div className="group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-white/20 transition-colors">
                      <Zap className="w-6 h-6 text-yellow-400" />
                    </div>
                    <p className="text-white/70 text-xs font-medium">Instant</p>
                  </div>
                  <div className="group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-white/20 transition-colors">
                      <PiggyBank className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-white/70 text-xs font-medium">Smart</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-center text-white/50 text-sm">
                  Powered by <span className="font-semibold text-white/70">Supabase</span> • 
                  <span className="font-semibold text-white/70">SOC 2 Compliant</span>
                </p>
              </div>
            </div>

            {/* Bottom text */}
            <div className="text-center mt-8">
              <p className="text-white/40 text-sm">
                Join thousands of users who trust FinanceFlow
                <br />
                with their financial future
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-70"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-50 delay-1000"></div>
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping opacity-60 delay-500"></div>
    </div>
  )
}
