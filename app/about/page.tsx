"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Target, Heart, Award, Globe, CheckCircle, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useSession } from "next-auth/react"; // Add this import

// Removed the "Meet Our Team" and "Milestones" sections as requested.
export default function AboutPage() {
  const { data: session } = useSession(); // Add this line

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-green-400" />,
      title: "Community First",
      description: "We believe in empowering student communities and helping them create memorable experiences.",
    },
    {
      icon: <Target className="h-8 w-8 text-green-400" />,
      title: "Innovation",
      description: "Constantly pushing boundaries with AI and technology to solve real-world problems.",
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
      title: "Collaboration",
      description: "Building bridges between brands and educational institutions for mutual growth.",
    },
    {
      icon: <Award className="h-8 w-8 text-green-400" />,
      title: "Excellence",
      description: "Committed to delivering exceptional results and exceeding expectations.",
    },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"> {/* Changed from min-h-screen to min-h-[70vh] */}
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Add this overlay for the gradual fade to black */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-300 mb-3"> {/* Changed mb-4 to mb-3 */}
            About{" "}
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              EventNest
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-6"> {/* Changed mb-8 to mb-6 */}
            We're on a mission to revolutionize how college fests and events connect with sponsors, creating meaningful
            partnerships that elevate student experiences across India. 
            College events are listed by their respective colleges, allowing sponsors to browse through and choose the events that align with their interests and goals. 
            <span className="text-green-400">
            {" "}For now, this platform is completely free, making it accessible
            to all colleges and sponsors looking to create impactful connections.
            </span> 
          </p>
          
          {/* Launch Message */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-green-400/50 transition-all duration-300 mt-8"> {/* Changed p-8 to p-6 and mt-12 to mt-8 */}
            <div className="text-xl text-green-400 font-semibold mb-2">Platform Launch</div>
            <p className="text-gray-400">
              Be among the first to join our platform! We're currently onboarding early access partners and launching soon.
              Join now to get priority access and shape the future of college event sponsorships.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6"> {/* Changed mt-8 to mt-6 */}
            <Link href="/signup">
              <button className="px-8 py-3 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-all duration-300 font-medium">
                Get Early Access
              </button>
            </Link>
            <Link href="/sponsorships">
              <button className="px-8 py-3 border border-green-400 text-green-400 rounded-lg hover:bg-green-400 hover:text-black transition-all duration-300 font-medium">
                Preview Platform
              </button>
            </Link>
          </div>
        </div>

        {/* Add animated gradient orbs */}
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-2 border-green-100 bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-white">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-lg leading-relaxed">
                  To democratize access to sponsorship opportunities for college fests and events across India, while helping
                  brands connect authentically with the next generation of consumers through AI-powered matching and
                  seamless collaboration tools.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-white">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-lg leading-relaxed">
                  To become the leading platform that transforms every college fest into a world-class experience,
                  fostering innovation, creativity, and meaningful connections between students and industry leaders
                  across the globe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Story</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Born from the frustration of organizing college festivals and the challenge of finding the right sponsors
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">The Problem We Solved</h3>
              <div className="space-y-4 text-gray-400">
                <p>
                  As former college festival organizers, we experienced firsthand the challenges of securing
                  sponsorships. Students would spend months cold-calling companies, sending countless emails, and often
                  settling for inadequate partnerships.
                </p>
                <p>
                  Meanwhile, brands struggled to identify authentic opportunities to connect with young audiences, often
                  missing out on vibrant college festivals that perfectly matched their target demographics.
                </p>
                <p>
                  We realized there had to be a better way - a platform that could intelligently match festivals with
                  sponsors based on mutual value and shared objectives.
                </p>
              </div>
            </div>
            <div className="bg-gray-900 border-gray-800 p-8 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold text-white mb-4">The EventNest Difference</h4>
              <div className="space-y-3">
                {[
                  "AI-driven sponsor-festival matchmaking",
                  "Detailed festival and sponsor profiles",
                  "Effortless sponsorship application process",
                  "Actionable insights with real-time analytics",
                  "Responsive and dedicated support team",
                  "Fair and transparent pricing models",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-400">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center border-2 hover:shadow-lg transition-shadow bg-gray-900 border-gray-800"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <CardTitle className="text-xl text-white">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

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
                  {!session || session.user?.userType === 'college' ? (
                    <>
                      <li>
                        <Link 
                          href="/signup"
                          className="text-gray-400 hover:text-green-400 transition-colors"
                        >
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
                    </>
                  ) : (
                    <li className="text-gray-500 italic h-full">
                      You're currently logged in as a sponsor. 
                      <Link href="/signup" className="text-green-400 hover:text-green-500 ml-1">
                        Switch to college account
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              <div className="h-full">
                <h3 className="text-white font-semibold mb-4">For Sponsors</h3>
                <ul className="space-y-4">
                  {!session || session.user?.userType === 'sponsor' ? (
                    <>
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
                    </>
                  ) : (
                    <li className="text-gray-500 italic h-full">
                      You're currently logged in as a college. 
                      <Link href="/signup" className="text-green-400 hover:text-green-500 ml-1">
                        Switch to sponsor account
                      </Link>
                    </li>
                  )}
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
