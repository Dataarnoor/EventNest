"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar";
import {
  ArrowRight,
  Target,
  Zap,
  CheckCircle,
  Users,
  TrendingUp,
  Building,
  Heart,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Dynamically import Squares to avoid SSR issues
const Squares = dynamic(() => import("@/components/Squares"), { ssr: false });

export default function HomePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail) {
      setWaitlistSubmitted(true);
      alert("Thank you for joining the waitlist! We'll notify you soon.");
      setWaitlistEmail("");
    }
  };

  // Add this useEffect for notifications only on home page
  useEffect(() => {
    if (session?.user?.userType === 'college') {
      const checkNewApplications = async () => {
        try {
          const res = await fetch('/api/applications/college-applications');
          if (!res.ok) throw new Error('Failed to fetch applications');
          
          const data = await res.json();
          const pendingApplications = data.applications?.filter(
            (app: any) => app.status === 'pending'
          );

          if (pendingApplications?.length > 0) {
            toast({
              title: "New Sponsorship Applications",
              description: `You have ${pendingApplications.length} pending application(s)`,
              variant: "success",
            });
          }
        } catch (error) {
          console.error('Failed to check applications:', error);
        }
      };

      // Check immediately and then every 5 minutes
      checkNewApplications();
      const interval = setInterval(checkNewApplications, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [session, toast]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Section with Squares Background */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Squares
            direction="diagonal"
            speed={0.5}
            squareSize={60}
            borderColor="rgba(34, 197, 94, 0.2)"
            hoverFillColor="rgba(34, 197, 94, 0.1)"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/80 via-gray-900/60 to-black/80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.12),transparent_50%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-black pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="text-center">
            <div className="inline-block mb-4 px-3 py-1 bg-green-400/10 text-green-400 border border-green-400/20 rounded-full text-sm">
              Connecting Events to the Right Brands
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight md:leading-[1.08] pb-2">
              Powering Partnerships for Every Event and Beyond.
            </h1>
            <p className="text-2xl md:text-3xl text-gray-400 mb-10 max-w-3xl mx-auto font-medium">
              <span className="text-green-400 font-semibold">India's first platform</span> dedicated to empowering college events and sponsors. Build meaningful partnerships and create unforgettable experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!session ? (
                // Show both buttons for non-logged in users
                <>
                  <Link href="/event/create">
                    <button className="inline-flex items-center px-6 py-3 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black rounded-md text-lg font-medium transition-colors">
                      List Your College event
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="/sponsorships">
                    <button className="px-6 py-3 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black rounded-md text-lg font-medium transition-colors">
                      Browse Events
                    </button>
                  </Link>
                </>
              ) : session.user.userType === 'college' ? (
                // Show only event listing for college users
                <Link href="/event/create">
                  <button className="inline-flex items-center px-6 py-3 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black rounded-md text-lg font-medium transition-colors">
                    List Your College event
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </Link>
              ) : (
                // Show only sponsorship exploration for sponsor users
                <Link href="/sponsorships">
                  <button className="px-6 py-3 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black rounded-md text-lg font-medium transition-colors">
                    Explore Events to Sponsor
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose EventNest?</h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              The ultimate platform connecting college events with sponsors effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-900 border border-gray-800 hover:border-green-400/50 rounded-lg transition-all duration-300">
              <Target className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Event Listings</h3>
              <p className="text-gray-400">
                College events can easily list themselves, showcasing their unique offerings to potential sponsors.
              </p>
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 hover:border-green-400/50 rounded-lg transition-all duration-300">
              <Zap className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Sponsor Discovery</h3>
              <p className="text-gray-400">
                Sponsors can browse and choose from a variety of listed events that align with their goals.
              </p>
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 hover:border-green-400/50 rounded-lg transition-all duration-300">
              <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Seamless Connections</h3>
              <p className="text-gray-400">
                Facilitates direct communication between event organizers and sponsors for smooth collaboration.
              </p>
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 hover:border-green-400/50 rounded-lg transition-all duration-300">
              <Users className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Community Building</h3>
              <p className="text-gray-400">
                Join a growing network of college organizers and sponsors to foster meaningful partnerships.
              </p>
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 hover:border-green-400/50 rounded-lg transition-all duration-300">
              <TrendingUp className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Enhanced Visibility</h3>
              <p className="text-gray-400">
                Events gain exposure to a wide range of sponsors, increasing their chances of securing partnerships.
              </p>
            </div>

            <div className="p-6 bg-gray-900 border border-gray-800 hover:border-green-400/50 rounded-lg transition-all duration-300">
              <Building className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Effortless Management</h3>
              <p className="text-gray-400">
                Simplifies the process of finding and managing sponsorships for college events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founder Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet the Founder</h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              The visionary behind EventNest, building the future of event sponsorships.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="p-10 bg-gray-900 border-2 border-gray-800/90 text-center w-full max-w-5xl shadow-2xl rounded-lg">
              <h3 className="text-white text-3xl font-bold mb-2">Dataarnoor Singh</h3>
              <div className="text-green-400 text-lg font-medium mb-6">3rd Year Student & Fest Coordinator, IIIT Hyderabad</div>
              <div className="bg-gray-800/90 border-l-4 border-green-400 px-8 py-6 rounded-md text-gray-200 text-lg mb-8 shadow-lg">
                "As a fest coordinator at IIIT Hyderabad, I faced numerous challenges in organizing college events—finding sponsors, managing logistics, and ensuring a great experience for everyone involved. These difficulties inspired me to create this platform, so that students across the country can organize successful college fests with ease, and companies can seamlessly connect with the right events. My vision is to empower student communities and make event organization accessible, efficient, and impactful for all."
              </div>
              <div className="mb-2 text-gray-400 text-base font-semibold">Connect:</div>
              <div className="flex justify-center gap-6 mt-2">
                <a href="https://linkedin.com/in/dataarnoor" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/dataarnoor" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.07-1.276.058-2.687.334-3.678 1.325-.991.991-1.267 2.402-1.325 3.678-.058 1.28-.07 1.688-.07 4.947s.012 3.667.07 4.947c.058 1.276.334 2.687 1.325 3.678.991.991 2.402 1.267 3.678 1.325 1.28.058 1.688.07 4.947.07s3.667-.012 4.947-.07c1.276-.058 2.687-.334 3.678-1.325.991-.991 1.267-2.402 1.325-3.678.058-1.28.07-1.688.07-4.947s-.012-3.667-.07-4.947c-.058-1.276-.334-2.687-1.325-3.678-.991-.991-2.402-1.267-3.678-1.325-1.28-.058-1.688-.07-4.947-.07zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
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
        {/* Add copyright notice */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          © 2025 EventNest. All rights reserved.
        </div>
      </footer>
    </div>  
  )
}