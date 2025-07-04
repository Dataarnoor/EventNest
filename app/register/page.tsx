import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Building } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300 mb-6">
            <Trophy className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">EventNest</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">Join EventNest</h2>
          <p className="mt-2 text-gray-400">Choose how you'd like to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-900 border-gray-800 hover:border-green-400/50 transition-all duration-300">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-2xl text-white">I'm a College</CardTitle>
              <CardDescription className="text-gray-400">List your festival and connect with sponsors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Create detailed festival listings</li>
                <li>• Manage sponsorship packages</li>
                <li>• Connect with relevant sponsors</li>
                <li>• Track applications and partnerships</li>
                <li>• Access analytics and insights</li>
              </ul>
              <Button asChild className="w-full bg-green-400 hover:bg-green-500 text-black">
                <Link href="/college/register">Register Your Festival</Link>
              </Button>
              <p className="text-xs text-center text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-green-400 hover:text-green-300">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-green-400/50 transition-all duration-300">
            <CardHeader className="text-center">
              <Building className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-2xl text-white">I'm a Sponsor</CardTitle>
              <CardDescription className="text-gray-400">Discover festivals and grow your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Browse college festivals</li>
                <li>• Filter by audience and budget</li>
                <li>• Apply for sponsorship opportunities</li>
                <li>• Manage partnerships</li>
                <li>• Track ROI and engagement</li>
              </ul>
              <Button asChild className="w-full bg-green-400 hover:bg-green-500 text-black">
                <Link href="/sponsor/register">Register as Sponsor</Link>
              </Button>
              <p className="text-xs text-center text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-green-400 hover:text-green-300">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/" className="text-green-400 hover:text-green-300 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
