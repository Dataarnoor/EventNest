import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Trophy } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Trophy className="h-16 w-16 text-green-400" />
        </div>
        <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Button asChild className="bg-green-400 hover:bg-green-500 text-black">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
}    