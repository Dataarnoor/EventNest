"use client";
import { use } from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditEventPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    expectedAttendance: "",
    sponsorshipTiers: "",
  });

  useEffect(() => {
    if (!session || session.user.userType !== 'college') {
      router.push('/signin');
      return;
    }

    // Load event data
    const loadEvent = async () => {
      try {
        const res = await fetch(`/api/events/${resolvedParams.id}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        setEventData({
          title: data.event.title,
          description: data.event.description,
          date: new Date(data.event.date).toISOString().split('T')[0],
          venue: data.event.venue,
          expectedAttendance: data.event.expectedAttendance.toString(),
          sponsorshipTiers: data.event.sponsorshipTiers,
        });
      } catch (error) {
        setError("Failed to load event");
        console.error(error);
      }
    };

    loadEvent();
  }, [session, router, resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update event');
      }

      router.push('/my-events');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session || session.user.userType !== 'college') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You must be logged in as a college to edit events.</p>
          <Link href="/signin" className="text-green-400 hover:text-green-500">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/my-events" className="inline-flex items-center text-gray-400 hover:text-green-400 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Events
        </Link>

        <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <input
                type="text"
                value={eventData.title}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setEventData({...eventData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={eventData.description}
                required
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setEventData({...eventData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Event Date</label>
                <input
                  type="date"
                  value={eventData.date}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                  onChange={(e) => setEventData({...eventData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Venue</label>
                <input
                  type="text"
                  value={eventData.venue}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                  onChange={(e) => setEventData({...eventData, venue: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expected Attendance</label>
              <input
                type="number"
                value={eventData.expectedAttendance}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setEventData({...eventData, expectedAttendance: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sponsorship Tiers</label>
              <textarea
                value={eventData.sponsorshipTiers}
                required
                rows={3}
                placeholder="Describe your sponsorship packages..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setEventData({...eventData, sponsorshipTiers: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/my-events">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
