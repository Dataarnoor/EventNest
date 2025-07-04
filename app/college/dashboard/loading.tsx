import { Trophy } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-4">
          <Trophy className="h-12 w-12 text-green-400 mx-auto animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading Dashboard</h2>
        <p className="text-gray-400">Setting up your festival management center...</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      </div>
    </div>
  )
}
