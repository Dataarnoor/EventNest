"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    email: "",
    collegeName: "",
    companyName: "",
    location: "",
    industry: "",
    website: "",
    contactPerson: "",
    phoneNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      router.push('/signin');
      return;
    }

    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        setUserData(data.user);
        setLoading(false);
      });
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!res.ok) throw new Error('Failed to update profile');
      
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Add back button */}
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-green-400 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg opacity-50"
              />
            </div>

            {session?.user.userType === 'college' ? (
              <div>
                <label className="block text-sm font-medium mb-2">College Name</label>
                <input
                  type="text"
                  value={userData.collegeName}
                  disabled={!isEditing}
                  onChange={(e) => setUserData({...userData, collegeName: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value={userData.companyName}
                    disabled={!isEditing}
                    onChange={(e) => setUserData({...userData, companyName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <input
                    type="text"
                    value={userData.industry}
                    disabled={!isEditing}
                    onChange={(e) => setUserData({...userData, industry: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <input
                    type="url"
                    value={userData.website}
                    disabled={!isEditing}
                    onChange={(e) => setUserData({...userData, website: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={userData.location}
                disabled={!isEditing}
                onChange={(e) => setUserData({...userData, location: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Person</label>
              <input
                type="text"
                value={userData.contactPerson}
                disabled={!isEditing}
                onChange={(e) => setUserData({...userData, contactPerson: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={userData.phoneNumber}
                disabled={!isEditing}
                onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
              />
            </div>

            <div className="flex justify-end gap-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
