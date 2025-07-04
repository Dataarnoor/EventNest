'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">An error occurred while loading this page.</p>
        <Button
          onClick={reset}
          className="bg-green-400 hover:bg-green-500 text-black"
        >
          Try again
        </Button>
      </div>
    </div>
  )
} 