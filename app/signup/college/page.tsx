"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function CollegeSignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", // Changed from collegeName to name to match API
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    contactPerson: "",
    phoneNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          userType: 'college',
          location: formData.location.trim(),
          contactPerson: formData.contactPerson.trim(),
          phoneNumber: formData.phoneNumber.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create account');
      }

      console.log('Signup successful:', data);
      router.push('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/signup" className="inline-flex items-center text-gray-400 hover:text-green-400 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to options
        </Link>

        <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-8">Register Your College</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">College Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setFormData({...formData, name: e.target.value})} // Changed from collegeName to name
                value={formData.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                value={formData.email}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  value={formData.password}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  value={formData.confirmPassword}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                value={formData.location}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Person Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                value={formData.contactPerson}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                value={formData.phoneNumber}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
