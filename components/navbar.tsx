"use client";

import { Button } from "@/components/ui/button"
import { Trophy, User, Menu, X } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6 w-full min-w-0">
          {/* Left: Hamburger for mobile and Logo section */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              className="md:hidden p-2 text-gray-300 hover:text-green-400 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-7 w-7" />
            </button>
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="EventNest Logo" className="h-8 w-8 rounded-md mr-3" />
              <span className="text-2xl font-bold">EventNest</span>
            </Link>
          </div>
          {/* Navigation Links (center, desktop only) */}
          <nav className="hidden md:flex space-x-8 flex-1 justify-center min-w-0">
            <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors">
              Home
            </Link>
            <Link href="/sponsorships" className="text-gray-300 hover:text-green-400 transition-colors">
              Browse Events
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-green-400 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
              Contact
            </Link>
          </nav>
          {/* Auth Buttons / Profile */}
          <div className="flex items-center gap-4 ml-3 max-w-full">
            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 text-white hover:text-green-400 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{session.user?.email}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1 z-50">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-green-400">
                      Profile Settings
                    </Link>
                    {session.user?.userType === 'college' && (
                      <>
                        <Link href="/my-events" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-green-400">
                          Manage Events
                        </Link>
                        <Link href="/college/applications" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-green-400">
                          View Applications
                        </Link>
                      </>
                    )}
                    {session.user?.userType === 'sponsor' && (
                      <Link href="/my-sponsorships" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-green-400">
                        My Applications
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/signin">
                  <button className="px-1 py-2 text-white hover:text-green-400 transition-colors text-sm whitespace-nowrap ml-3">
                    Sign in
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-1 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors text-sm whitespace-nowrap">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
          {/* Sidebar */}
          <div className="relative w-full max-w-xs md:w-80 md:max-w-full bg-gray-900 border-r border-gray-800 h-screen flex flex-col p-8 pt-6 animate-slide-in-left overflow-y-auto shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-green-400"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>
            <nav className="flex flex-col gap-8 mt-14">
              <Link href="/" className="text-gray-100 hover:text-green-400 text-xl font-semibold px-2 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                Home
              </Link>
              <Link href="/sponsorships" className="text-gray-100 hover:text-green-400 text-xl font-semibold px-2 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                Browse Events
              </Link>
              <Link href="/about" className="text-gray-100 hover:text-green-400 text-xl font-semibold px-2 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                About Us
              </Link>
              <Link href="/contact" className="text-gray-100 hover:text-green-400 text-xl font-semibold px-2 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                Contact
              </Link>
            </nav>
            <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col gap-6">
              {session ? (
                <>
                  <Link href="/profile" className="text-gray-300 hover:text-green-400 text-lg px-2 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                    Profile Settings
                  </Link>
                  {session.user?.userType === 'college' && (
                    <>
                      <Link href="/my-events" className="text-gray-300 hover:text-green-400 text-lg px-2 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                        Manage Events
                      </Link>
                      <Link href="/college/applications" className="text-gray-300 hover:text-green-400 text-lg px-2 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                        View Applications
                      </Link>
                    </>
                  )}
                  {session.user?.userType === 'sponsor' && (
                    <Link href="/my-sponsorships" className="text-gray-300 hover:text-green-400 text-lg px-2 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                      My Applications
                    </Link>
                  )}
                  <button
                    onClick={() => { setSidebarOpen(false); signOut({ callbackUrl: '/' }); }}
                    className="text-gray-300 hover:text-red-400 text-lg text-left px-2 py-2 rounded"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="text-gray-300 hover:text-green-400 text-lg px-2 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                    Sign in
                  </Link>
                  <Link href="/signup" className="text-gray-300 hover:text-green-400 text-lg px-2 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
