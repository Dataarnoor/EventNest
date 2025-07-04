"use client";
import { Building2, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
      {/* Home button top left */}
      <Link
        href="/"
        className="absolute top-6 left-6 px-4 py-2 rounded-md border border-green-400 text-green-400 hover:bg-green-400/10 font-semibold transition"
      >
        Home
      </Link>
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Create an Account</h1>
          <p className="text-xl text-gray-400">Choose how you want to join EventNest</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* College Signup Option */}
          <Link href="/signup/college" className="group">
            <div className="p-8 bg-gray-900 border-2 border-gray-800 rounded-xl hover:border-green-400/50 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <GraduationCap className="h-16 w-16 text-green-400 mb-6" />
                <h2 className="text-2xl font-bold mb-4">College</h2>
                <p className="text-gray-400 mb-6">
                  Register your college events and connect with potential sponsors
                </p>
                <div className="inline-flex items-center justify-center px-6 py-3 border border-green-400 text-green-400 rounded-lg group-hover:bg-green-400 group-hover:text-black transition-all duration-300">
                  Sign up as College
                </div>
              </div>
            </div>
          </Link>

          {/* Sponsor Signup Option */}
          <Link href="/signup/sponsor" className="group">
            <div className="p-8 bg-gray-900 border-2 border-gray-800 rounded-xl hover:border-green-400/50 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <Building2 className="h-16 w-16 text-green-400 mb-6" />
                <h2 className="text-2xl font-bold mb-4">Sponsor</h2>
                <p className="text-gray-400 mb-6">
                  Discover and sponsor college events that align with your brand
                </p>
                <div className="inline-flex items-center justify-center px-6 py-3 border border-green-400 text-green-400 rounded-lg group-hover:bg-green-400 group-hover:text-black transition-all duration-300">
                  Sign up as Sponsor
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-green-400 hover:text-green-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
