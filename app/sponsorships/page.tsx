"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Trophy,
  Heart,
  TrendingUp,
  Star,
  ArrowRight,
  Send,
  Download,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import Particles from "@tsparticles/react"
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"
import mongoose from "mongoose";
import Link from "next/link";

interface Festival {
  id: string
  name: string
  college: string
  city: string
  date: string
  endDate: string
  attendance: string
  type: string
  category: string
  packages: Array<{
    name: string
    price: string
    benefits: string[]
  }>
  image: string
  featured: boolean
  trending: boolean
  rating: number
  previousSponsors: string[]
  description: string
  saved: boolean
  brochurePdf?: {
    url: string;
    filename: string;
  };
  eventTypes?: string[];
  budgetRange?: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  city: string;
  expectedAttendance: number;
  sponsorshipTiers: string;
  college: {
    collegeName?: string;
    name?: string;
    location?: string;
  } | string;
  brochurePdf?: {
    url: string;
    filename: string;
  };
  eventTypes?: string[];
  budgetRange?: string;
}

export default function SponsorshipsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedBudget, setSelectedBudget] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [applyDialog, setApplyDialog] = useState<{ open: boolean; festival: Festival | null }>({
    open: false,
    festival: null,
  })
  const [applicationForm, setApplicationForm] = useState({
    package: "",
    message: "",
    companyName: "",
    email: "",
  })
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [detailsEvent, setDetailsEvent] = useState<Festival | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/events');
        const data = await response.json();

        if (!data || !Array.isArray(data.events)) {
          throw new Error('Invalid response format: events array expected');
        }

        const cities = [...new Set(data.events.map((event: Event) =>
          event.city || "City not specified"
        ))].filter(Boolean) as string[];

        setAvailableLocations(cities);

        // --- FIX: Ensure backend populates college with collegeName ---
        // If event.college is a string (ObjectId), the backend did NOT populate it.
        // You must update your /api/events endpoint to use:
        // .populate('college', 'collegeName')
        // so event.college is { collegeName: "IIIT Hyd", ... }
        // Otherwise, fallback to string or show warning.

        const collegeIdToName: Record<string, string> = {
          "685b4eca6cf3d41912205e2a": "IIIT HYDERABAD",
          // Add more mappings as needed
        };

        const formattedEvents = data.events.map((event: Event) => ({
          id: event._id,
          name: event.title,
          college:
            event.college && typeof event.college === "object" && "name" in event.college && event.college.name
              ? event.college.name
              : (typeof event.college === "string" && (event.college as string).length > 0)
                ? (collegeIdToName[event.college as string] || event.college)
                : "Unknown College",
          city: event.city || "City not specified",
          date: new Date(event.date).toISOString(),
          endDate: new Date(event.date).toISOString(),
          attendance: `${event.expectedAttendance || 0}+`,
          type: event.eventTypes && event.eventTypes.length > 0 ? event.eventTypes[0] : "College Event",
          category: "Event",
          packages: [{
            name: "Sponsorship",
            price: event.sponsorshipTiers || "Contact for pricing",
            benefits: [event.description || "No description available"]
          }],
          image: '',
          featured: false,
          trending: false,
          rating: 5,
          previousSponsors: [],
          description: event.description || "No description available",
          saved: false,
          brochurePdf: event.brochurePdf,
          eventTypes: event.eventTypes || [],
          budgetRange: event.budgetRange || "Contact for details",
        }));
        setFestivals(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        const errorMessage = error instanceof Error
          ? `Failed to load events: ${error.message}`
          : 'An unexpected error occurred while loading events';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [toast]);

  // Fetch wishlist on load
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!session?.user) return;
      try {
        const res = await fetch('/api/user/profile', { method: 'GET' });
        const data = await res.json();
        if (data.wishlist) {
          setWishlist(data.wishlist.map((e: any) => e._id));
        }
      } catch (err) {
        // ignore
      }
    };
    fetchWishlist();
  }, [session]);

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-400 hover:bg-green-500 text-black"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading events...</p>
        </div>
      </div>
    );
  }
  if (!loading && festivals.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Events Found</h2>
          <p className="text-gray-400">Check back later for upcoming events.</p>
        </div>
      </div>
    );
  }
  const handleSaveFestival = (festivalId: string) => {
    const updatedFestivals = festivals.map((f) => (f.id === festivalId ? { ...f, saved: !f.saved } : f))
    setFestivals(updatedFestivals)
  }
  const handleApplyForSponsorship = async () => {
    if (!session?.user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to apply",
        variant: "destructive",
      });
      return;
    }
    // Only require companyName (not package or email field)
    if (applyDialog.festival && applicationForm.companyName.trim()) {
      try {
        const applicationData = {
          event: applyDialog.festival.id,
          package: "",
          message: applicationForm.message || '',
          sponsorEmail: session.user.email,
          companyName: applicationForm.companyName.trim(),
        };
        const res = await fetch('/api/applications/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(applicationData),
        });
        const data = await res.json();
        if (!res.ok) {
          // Show backend error if present
          if (data.error?.toLowerCase().includes('missing required fields')) {
            toast({
              title: "Missing required fields",
              description: "Please fill in your company name.",
              variant: "destructive",
            });
          } else if (data.error?.includes('duplicate key error') || data.error?.includes('already applied')) {
            toast({
              title: "Already Applied",
              description: "You have already submitted an application for this event",
              variant: "destructive",
            });
          } else {
            throw new Error(data.error || 'Failed to submit application');
          }
          return;
        }
        toast({
          title: "Success",
          description: "Application submitted successfully!",
          variant: "success",
        });
        setApplyDialog({ open: false, festival: null });
        setApplicationForm({
          package: "",
          message: "",
          companyName: "",
          email: "",
        });
      } catch (error: any) {
        console.error('Application submission error:', error);
        toast({
          title: "Error",
          description: "Failed to submit application. You might have already applied for this event.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Missing required fields",
        description: "Please fill in your company name.",
        variant: "destructive",
      });
    }
  };
  const handleDownloadBrochure = (festival: Festival) => {
    if (festival.brochurePdf?.url) {
      // Open PDF in new tab directly using public URL
      window.open(festival.brochurePdf.url, '_blank');
    } else {
      alert('No brochure available for this event');
    }
  };
  const handleWishlistToggle = async (eventId: string, wishlisted: boolean) => {
    if (!session?.user) {
      toast({ title: 'Login required', description: 'Please sign in to use wishlist.', variant: 'destructive' });
      return;
    }
    try {
      if (!wishlisted) {
        await fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId }),
        });
        setWishlist((prev) => [...prev, eventId]);
      } else {
        await fetch('/api/user/profile', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId }),
        });
        setWishlist((prev) => prev.filter((id) => id !== eventId));
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Could not update wishlist', variant: 'destructive' });
    }
  };
  const filteredFestivals = festivals.filter((festival: Festival) => {
    if (showWishlistOnly && !wishlist.includes(festival.id)) return false;
    const matchesSearch = searchTerm === "" ||
      festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || 
      (festival.eventTypes && festival.eventTypes.includes(selectedType));
    const matchesLocation = selectedLocation === "all" || 
      festival.city.toLowerCase() === selectedLocation.toLowerCase();
    const matchesBudget = selectedBudget === "all" || 
      (festival.budgetRange && festival.budgetRange === selectedBudget);
    return matchesSearch && matchesType && matchesLocation && matchesBudget;
  });
  // Sort festivals
  const sortedFestivals = [...filteredFestivals].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "budget":
        const aMinPrice = Math.min(...a.packages.map((p) => Number.parseInt(p.price.replace(/[₹,]/g, ""))))
        const bMinPrice = Math.min(...b.packages.map((p) => Number.parseInt(p.price.replace(/[₹,]/g, ""))))
        return aMinPrice - bMinPrice
      case "attendance":
        const aAttendance = Number.parseInt(a.attendance.replace(/[+,]/g, ""))
        const bAttendance = Number.parseInt(b.attendance.replace(/[+,]/g, ""))
        return bAttendance - aAttendance
      default:
        // Relevance: featured first, then trending
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        if (a.trending && !b.trending) return -1
        if (!a.trending && b.trending) return 1
        return 0
    }
  })
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 -z-10">
        <Particles
          id="tsparticles-home"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: 60,
            particles: {
              number: { value: 120, density: { enable: true } },
              color: { value: ["#22c55e", "#a7f3d0", "#bbf7d0", "#16a34a"] },
              shape: { type: "circle" },
              opacity: { value: 0.5 },
              size: { value: 4 },
              move: { enable: true, speed: 1.5, direction: "none", outModes: { default: "out" } },
              links: { enable: true, color: "#22c55e", distance: 120, opacity: 0.3, width: 1.5 },
            },
            detectRetina: true,
          }}
        />
        {/* Fallback animated background if particles fail */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent animate-gradient" style={{zIndex: -1}}></div>
        </div>
      </div>
      {/* Header */}
      <Navbar />
      {/* Main Content */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Changed max-w-7xl to max-w-[90rem] */}
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Sponsorship</span> <span className="text-green-400">Opportunities</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover premium college fests and events across India. Connect with your target audience through
            strategic partnerships.
          </p>
        </div>
        {/* Search and Filters */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search festivals, colleges, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Festival Type" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="technical" className="text-white">Technical</SelectItem>
                  <SelectItem value="cultural" className="text-white">Cultural</SelectItem>
                  <SelectItem value="business" className="text-white">Business</SelectItem>
                  <SelectItem value="sports" className="text-white">Sports</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="all" className="text-white">All Locations</SelectItem>
                  {availableLocations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase()} className="text-white">
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Budget Range" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="all" className="text-white">All Budgets</SelectItem>
                  <SelectItem value="50k-1l" className="text-white">Under ₹1L</SelectItem>
                  <SelectItem value="1l-2.5l" className="text-white">₹1L - ₹2.5L</SelectItem>
                  <SelectItem value="2.5l-5l" className="text-white">₹2.5L - ₹5L</SelectItem>
                  <SelectItem value="5l+" className="text-white">Above ₹5L</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {/* Results Count and Sort */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-400">
            Showing {sortedFestivals.length} of {festivals.length} festivals
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className={`flex items-center gap-2 px-4 py-2 font-semibold border-2 transition-colors duration-150 ${
                showWishlistOnly
                  ? 'border-green-400 text-green-400 bg-transparent hover:bg-green-400/10'
                  : 'border-gray-700 text-green-400 bg-transparent hover:border-green-400 hover:text-green-400'
              }`}
              onClick={() => setShowWishlistOnly((v) => !v)}
            >
              <Heart className={`h-5 w-5 mr-2 ${showWishlistOnly ? 'text-green-400 fill-green-400' : 'text-green-400 group-hover:text-green-400'}`} />
              Wishlist
            </Button>
            <span className="text-gray-400">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="relevance" className="text-white">Relevance</SelectItem>
                <SelectItem value="date" className="text-white">Date</SelectItem>
                <SelectItem value="budget" className="text-white">Budget</SelectItem>
                <SelectItem value="attendance" className="text-white">Attendance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Festival Listings - Improved Card UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {sortedFestivals.map((festival) => (
            <div
              key={festival.id}
              className="relative bg-gradient-to-br from-gray-900 via-gray-900/90 to-gray-800 border border-gray-800 rounded-2xl shadow-lg hover:border-green-400/70 transition-all duration-300 group flex flex-col"
            >
              {/* Accent Header Line */}
              <div className="h-2 w-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-2xl" />
              {/* Wishlist Button (top right) */}
              <button
                className={`absolute top-4 right-4 z-10 rounded-full p-2 bg-gray-800 border border-gray-700 transition-colors shadow group-hover:border-green-400 ${wishlist.includes(festival.id) ? 'bg-green-400/20 border-green-400' : ''}`}
                title={wishlist.includes(festival.id) ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => handleWishlistToggle(festival.id, wishlist.includes(festival.id))}
              >
                <Heart className={`h-5 w-5 transition-colors ${wishlist.includes(festival.id) ? 'text-green-400 fill-green-400' : 'text-gray-400 group-hover:text-green-400'}`} />
              </button>
              <div className="flex flex-col flex-grow p-7">
                {/* Title and College */}
                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-white mb-1 truncate">{festival.name}</h3>
                  <p className="text-green-400 text-sm font-semibold mb-2 truncate">{festival.college}</p>
                </div>
                {/* Event Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {festival.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {new Date(festival.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {festival.attendance}
                  </span>
                </div>
                {/* Event Types & Budget */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {festival.eventTypes?.map((type, idx) => (
                    <Badge key={idx} variant="outline" className="border-green-400 text-green-300">{type}</Badge>
                  ))}
                  {festival.budgetRange && (
                    <Badge variant="outline" className="border-green-400 text-green-300">
                      {festival.budgetRange}
                    </Badge>
                  )}
                </div>
                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-1 text-sm">Event Description:</h4>
                  <p className="text-gray-300 text-sm line-clamp-3">{festival.description}</p>
                </div>
                {/* Previous Sponsors */}
                {festival.previousSponsors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-1 text-sm">Previous Sponsors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {festival.previousSponsors.map((sponsor, index) => (
                        <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                          {sponsor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-auto">
                  {!session ? (
                    <>
                      <Button
                        className="bg-green-400 hover:bg-green-500 text-black font-semibold flex-1"
                        onClick={() => router.push('/signup')}
                      >
                        Apply for Sponsorship
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-green-400 hover:bg-gray-800 flex-1"
                        onClick={() => router.push('/')}
                      >
                        Home
                      </Button>
                    </>
                  ) : session.user?.userType === 'sponsor' ? (
                    <Button
                      className="bg-green-400 hover:bg-green-500 text-black font-semibold flex-1"
                      onClick={() => setApplyDialog({ open: true, festival })}
                    >
                      Apply for Sponsorship
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-gray-700 text-gray-300 cursor-not-allowed flex-1"
                      disabled
                      title="Only sponsors can apply for sponsorship"
                    >
                      Apply for Sponsorship
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 flex-1"
                    onClick={() => handleDownloadBrochure(festival)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Brochure
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-green-400 hover:bg-gray-800 flex-1 min-w-[120px] md:min-w-[unset]"
                    onClick={() => setDetailsEvent(festival)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}

        </div>
        {/* Apply Dialog */}
        <Dialog open={applyDialog.open} onOpenChange={(open) => setApplyDialog({ open, festival: null })}>
          <DialogContent className="max-w-md bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Apply for Sponsorship</DialogTitle>
              <DialogDescription className="text-gray-400">
                Apply to sponsor {applyDialog.festival?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName" className="text-white">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  placeholder="Your company name"
                  value={applicationForm.companyName}
                  onChange={(e) => setApplicationForm({ ...applicationForm, companyName: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  Contact Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  value={session?.user?.email || ""}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              {/* Removed Sponsorship Package dropdown */}
              <div>
                <Label htmlFor="message" className="text-white">
                  Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell them why you'd like to sponsor this festival..."
                  value={applicationForm.message}
                  onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                  onClick={() => setApplyDialog({ open: false, festival: null })}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-400 hover:bg-green-500 text-black"
                  onClick={handleApplyForSponsorship}
                  disabled={!applicationForm.companyName.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {detailsEvent && (
          <Dialog open={!!detailsEvent} onOpenChange={() => setDetailsEvent(null)}>
            <DialogContent className="max-w-lg bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">{detailsEvent.name}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  {detailsEvent.college} &mdash; {detailsEvent.city}
                </DialogDescription>
              </DialogHeader>
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-1 text-sm">Event Description:</h4>
                <p className="text-gray-300 text-base">{detailsEvent.description}</p>
              </div>
              {/* Add more details as needed */}
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300"
                onClick={() => setDetailsEvent(null)}
              >
                Close
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

