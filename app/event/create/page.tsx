"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

const EVENT_TYPES = [
  "Technical",
  "Cultural",
  "Business",
  "Sports",
  "Literary",
  "Arts",
  "Social",
  "Other"
] as const;

const BUDGET_RANGES = [
  "Under ₹50K",
  "₹50K - ₹1L",
  "₹1L - ₹2.5L",
  "₹2.5L - ₹5L",
  "Above ₹5L"
] as const;

const LOCATIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Other"
] as const;

export default function CreateEventPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    city: "",
    expectedAttendance: "",
    sponsorshipTiers: "",
    requirements: "",
    benefits: "",
    eventTypes: [] as string[],
    budgetRange: "",
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setUploadError("Please upload a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setUploadError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Upload PDF file
      let brochureData = null;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) {
          throw new Error('Failed to upload brochure');
        }
        
        brochureData = await uploadRes.json();
      }

      // Create event with brochure data
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          brochurePdf: brochureData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      router.push('/sponsorships');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session || session.user.userType !== 'college') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You must be logged in as a college to create events.</p>
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
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-green-400 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
          
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
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setEventData({...eventData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
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
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                  onChange={(e) => setEventData({...eventData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                  onChange={(e) => setEventData({...eventData, city: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expected Footfall</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setEventData({...eventData, expectedAttendance: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sponsorship Tiers (refrerably mention expected amounts)</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your sponsorship packages..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                onChange={(e) => setEventData({...eventData, sponsorshipTiers: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Event Types</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {EVENT_TYPES.map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={eventData.eventTypes.includes(type)}
                      onChange={(e) => {
                        const updatedTypes = e.target.checked
                          ? [...eventData.eventTypes, type]
                          : eventData.eventTypes.filter(t => t !== type);
                        setEventData({...eventData, eventTypes: updatedTypes});
                      }}
                      className="rounded border-gray-700 bg-gray-800"
                    />
                    <span className="text-sm text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expected Budget Range</label>
              <select
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400"
                value={eventData.budgetRange}
                onChange={(e) => setEventData({...eventData, budgetRange: e.target.value})}
              >
                <option value="">Select Budget Range</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Event Brochure/Poster (PDF)
              </label>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF (Max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                {selectedFile && (
                  <p className="mt-2 text-sm text-green-400">
                    Selected file: {selectedFile.name}
                  </p>
                )}
                {uploadError && (
                  <p className="mt-2 text-sm text-red-400">
                    {uploadError}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Event..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
