'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { loginWithPassword, loginWithMagicLink } from '@/app/actions/auth'
import { Loader2, Mail, Lock, Zap, ArrowRight } from 'lucide-react'

type AuthMode = 'password' | 'magic'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')

  const [mode, setMode] = useState<AuthMode>('password')
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    urlError ? { type: 'error', text: 'Authentication failed. Please try again.' } : null
  )
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      if (mode === 'password') {
        const result = await loginWithPassword(formData)
        if (result?.error) setMessage({ type: 'error', text: result.error })
      } else {
        const result = await loginWithMagicLink(formData)
        if (result?.error) setMessage({ type: 'error', text: result.error })
        if (result?.success) setMessage({ type: 'success', text: result.success })
      }
    })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-white/50">Sign in to your dashboard</p>
      </div>

      {/* Mode toggle */}
      <div className="mb-6 flex rounded-lg bg-white/5 p-1">
        <button
          type="button"
          onClick={() => { setMode('password'); setMessage(null) }}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-all duration-200 ${
            mode === 'password'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => { setMode('magic'); setMessage(null) }}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-all duration-200 ${
            mode === 'magic'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          Magic Link
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-white/60">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="login-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {mode === 'password' && (
          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-white/60">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                id="login-password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              message.type === 'error'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {mode === 'password' ? 'Sign in' : 'Send Magic Link'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-white/30">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-violet-400 hover:text-violet-300 transition-colors">
          Create account
        </Link>
      </p>
    </div>
  )
}
