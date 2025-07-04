"use client"

import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Content with gradient background */}
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
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="space-y-6 text-gray-300">
              <p>
                At EventNest, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your information.
              </p>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Information We Collect</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Account information (name, email, institution/company details)</li>
                  <li>Event details and sponsorship preferences</li>
                  <li>Usage data and interaction with our platform</li>
                  <li>Communication records between colleges and sponsors</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To facilitate connections between colleges and sponsors</li>
                  <li>To improve our platform and services</li>
                  <li>To send relevant notifications and updates</li>
                  <li>To ensure platform security and prevent fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Data Protection</h2>
                <p>
                  We implement industry-standard security measures to protect your data. Your information is encrypted and stored securely.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
                <p>
                  If you have any questions about our privacy practices, please contact us at{' '}
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
