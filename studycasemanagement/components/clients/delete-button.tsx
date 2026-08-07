'use client'

import { useState, useTransition } from 'react'
import { deleteClientAction } from '@/app/actions/clients'
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react'

export function DeleteClientButton({ id, name }: { id: string; name: string }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteClientAction(id)
      if (result?.error) {
        setError(result.error)
        setShowConfirm(false)
      }
    })
  }

  return (
    <>
      <button
        id={`delete-client-${id}`}
        type="button"
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[oklch(0.14_0_0)] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>

            <h3 className="text-base font-semibold text-white">Delete client?</h3>
            <p className="mt-1.5 text-sm text-white/50">
              <span className="font-medium text-white/80">{name}</span> and all associated data
              will be permanently deleted. This cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
