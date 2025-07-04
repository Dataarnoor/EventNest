"use client"

import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-green-400 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 backdrop-blur-sm">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using EventNest, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. User Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Provide accurate and complete information when registering</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Ensure all posted event information is accurate and truthful</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. College Events</h2>
                <p>Colleges must:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Have proper authorization to list their events</li>
                  <li>Provide accurate event details and sponsorship requirements</li>
                  <li>Honor commitments made to sponsors</li>
                  <li>Maintain professional communication</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Sponsors</h2>
                <p>Sponsors must:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Represent legitimate businesses or organizations</li>
                  <li>Provide accurate company information</li>
                  <li>Honor sponsorship commitments</li>
                  <li>Maintain professional conduct in all interactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Platform Usage</h2>
                <p>Users agree not to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Misuse or abuse the platform</li>
                  <li>Engage in fraudulent activities</li>
                  <li>Harass or harm other users</li>
                  <li>Share false or misleading information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Changes to Terms</h2>
                <p>
                  EventNest reserves the right to modify these terms at any time. 
                  Users will be notified of significant changes. Continued use of the platform 
                  constitutes acceptance of modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Contact</h2>
                <p>
                  For questions about these terms, please contact us at{' '}
                  <a href="mailto:contacteventnest@gmail.com" className="text-green-400 hover:underline">
                    contacteventnest@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
