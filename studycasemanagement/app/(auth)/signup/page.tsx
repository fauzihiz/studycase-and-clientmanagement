'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'
import { Loader2, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'

export default function SignupPage() {
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signUp(formData)
      if (result?.error) setMessage({ type: 'error', text: result.error })
      if (result?.success) setMessage({ type: 'success', text: result.success })
    })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="mt-1 text-sm text-white/50">Access is restricted to authorized users</p>
      </div>

      {/* Info banner */}
      <div className="mb-6 rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-xs text-violet-300">
        <span className="font-semibold">Owner:</span> Set{' '}
        <code className="rounded bg-white/10 px-1 py-0.5 text-violet-200">ADMIN_EMAIL</code> in{' '}
        <code className="rounded bg-white/10 px-1 py-0.5 text-violet-200">.env.local</code> to
        allow your email to register.
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-xs font-medium text-white/60">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1.5 block text-xs font-medium text-white/60">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Minimum 8 characters"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

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
              Create account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-white/30">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
