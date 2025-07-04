"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, Clock } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-green-400" />,
      title: "Email Us",
      details: <a href="mailto:contacteventnest@gmail.com" className="text-green-400 hover:underline">contacteventnest@gmail.com</a>,
      description: "Send us an email anytime",
    },
    {
      icon: <Phone className="h-6 w-6 text-green-400" />,
      title: "Call Us",
      details: <a href="tel:+917986025683" className="text-green-400 hover:underline">+91 79860 25683</a>,
      description: "Available during business hours",
    },
    {
      icon: <Clock className="h-6 w-6 text-green-400" />,
      title: "Business Hours",
      details: "9:00 AM - 6:00 PM",
      description: "Monday to Friday",
    },
  ]

  const faqs = [
    {
      question: "How quickly do you respond to inquiries?",
      answer: "We aim to respond to all inquiries within 24 hours during business days.",
    },
    {
      question: "Do you offer support on weekends?",
      answer: "While our office is closed on weekends, our email support remains available for urgent matters.",
    },
    {
      question: "Can I schedule a video call consultation?",
      answer: "Yes, you can schedule a video call with our team by sending us an email with your preferred time slots.",
    },
    {
      question: "How can sponsors contact listed events directly?",
      answer: "Once registered, sponsors can use our platform's messaging system to contact event organizers directly.",
    },
    {
      question: "Is the platform free to use?",
      answer: "Yes, EventNest is currently completely free for both colleges and sponsors during our launch phase.",
    },
    {
      question: "How do you ensure event authenticity?",
      answer: "We verify all college events through official documentation and communication with the institution's authorized representatives.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background with Fade */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-300 mb-6">
            Get in{" "}
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Have questions about EventNest? Need help with your festival or sponsorship? We're here to help you every
            step of the way.
          </p>

          {/* Contact Info Cards - Changed to 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactInfo.map((info, index) => (
              <Card key={index} className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-green-400/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">{info.icon}</div>
                  <CardTitle className="text-xl text-white text-center">{info.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-semibold text-white mb-2">{info.details}</p>
                  <p className="text-gray-400 text-sm">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add animated gradient orbs */}
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-transparent"> {/* Changed from bg-gray-900/30 to bg-transparent */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Changed from max-w-4xl to max-w-6xl */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">Get quick answers to common questions about EventNest</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Changed from grid-cols-2 to grid-cols-3 and gap-8 to gap-6 */}
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-green-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm">{faq.answer}</p> {/* Added text-sm for better fit */}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Still have questions?</p>
            <Button asChild>
              <a href="mailto:contacteventnest@gmail.com" className="bg-green-400 text-black hover:bg-green-500">
                Send us an email
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8 rounded-t-2xl shadow-lg mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start">
            <div className="mb-8 md:mb-0 md:flex-1">
              <div className="flex items-center mb-4">
                <img src="/logo.png" alt="EventNest Logo" className="h-8 w-8 rounded-md mr-3" />
                <span className="text-2xl font-bold text-white">EventNest</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting college festivals with sponsors to create unforgettable experiences and meaningful
                partnerships.
              </p>
              <div className="flex space-x-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482A13.94 13.94 0 0 1 1.671 3.149a4.916 4.916 0 0 0 1.523 6.573 4.903 4.903 0 0 1-2.229-.616v.061a4.917 4.917 0 0 0 3.946 4.827 4.902 4.902 0 0 1-2.224.084 4.918 4.918 0 0 0 4.588 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.01-7.504 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0 0 24 4.557z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.07-1.276.058-2.687.334-3.678 1.325-.991.991-1.267 2.402-1.325 3.678-.058 1.28-.07 1.688-.07 4.947s.012 3.667.07 4.947c.058 1.276.334 2.687 1.325 3.678.991.991 2.402 1.267 3.678 1.325 1.28.058 1.688.07 4.947.07s3.667-.012 4.947-.07c1.276-.058 2.687-.334 3.678-1.325.991-.991 1.267-2.402 1.325-3.678.058-1.28.07-1.688.07-4.947s-.012-3.667-.07-4.947c-.058-1.276-.334-2.687-1.325-3.678-.991-.991-2.402-1.267-3.678-1.325-1.28-.058-1.688-.07-4.947-.07zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-16 md:w-1/2">
              <div className="h-full">
                <h3 className="text-white font-semibold mb-4">For Colleges</h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/signup" className="text-gray-400 hover:text-green-400 transition-colors">
                      Register Event
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-events" className="text-gray-400 hover:text-green-400 transition-colors">
                      Manage Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className="text-gray-400 hover:text-green-400 transition-colors">
                      Update Profile
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="h-full">
                <h3 className="text-white font-semibold mb-4">For Sponsors</h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/signup" className="text-gray-400 hover:text-green-400 transition-colors">
                      Become Sponsor
                    </Link>
                  </li>
                  <li>
                    <Link href="/sponsorships" className="text-gray-400 hover:text-green-400 transition-colors">
                      Browse Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-sponsorships" className="text-gray-400 hover:text-green-400 transition-colors">
                      My Applications
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-400 hover:text-green-400 transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          © 2024 EventNest. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
