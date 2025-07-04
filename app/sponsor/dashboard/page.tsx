"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, Users, Heart, Search, Filter, Trophy, Building, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Festival {
  id: string
  name: string
  college: string
  location: string
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
}

interface Application {
  id: string
  festival: string
  college: string
  package: string
  amount: string
  status: "Under Review" | "Approved" | "Rejected" | "Pending"
  appliedDate: string
  message?: string
}

export default function SponsorDashboard() {
  const router = useRouter()
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [myApplications, setMyApplications] = useState<Application[]>([])
  const [savedFestivals, setSavedFestivals] = useState<Festival[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedBudget, setSelectedBudget] = useState("all")
  const [applyDialog, setApplyDialog] = useState<{ open: boolean; festival: Festival | null }>({
    open: false,
    festival: null,
  })
  const [applicationForm, setApplicationForm] = useState({
    package: "",
    message: "",
    budget: "",
  })

  useEffect(() => {
    // Load festivals data without redirect logic
    const demoFestivals: Festival[] = [
      {
        id: "1",
        name: "TechFest Mumbai 2024",
        college: "Indian Institute of Technology Bombay",
        location: "Mumbai, Maharashtra",
        date: "2024-03-15",
        endDate: "2024-03-17",
        attendance: "25,000+",
        type: "Technical",
        category: "Engineering",
        packages: [
          {
            name: "Title Sponsor",
            price: "₹15,00,000",
            benefits: ["Logo on all materials", "Stage branding", "Product showcase"],
          },
          {
            name: "Co-Sponsor",
            price: "₹8,00,000",
            benefits: ["Logo placement", "Booth space", "Social media mentions"],
          },
          { name: "Event Sponsor", price: "₹3,00,000", benefits: ["Event naming rights", "Booth space"] },
        ],
        image: "/placeholder.svg?height=300&width=400",
        featured: true,
        trending: true,
        rating: 4.9,
        previousSponsors: ["Google", "Microsoft", "Amazon", "Flipkart"],
        description: "Asia's largest technical festival with cutting-edge competitions, workshops, and exhibitions.",
        saved: false,
      },
      {
        id: "2",
        name: "Mood Indigo 2024",
        college: "Indian Institute of Technology Bombay",
        location: "Mumbai, Maharashtra",
        date: "2024-12-20",
        endDate: "2024-12-23",
        attendance: "50,000+",
        type: "Cultural",
        category: "Arts & Culture",
        packages: [
          {
            name: "Title Sponsor",
            price: "₹25,00,000",
            benefits: ["Prime branding", "Celebrity meet access", "VIP hospitality"],
          },
          {
            name: "Co-Sponsor",
            price: "₹12,00,000",
            benefits: ["Stage branding", "Artist interaction", "Premium booth"],
          },
          { name: "Food Partner", price: "₹5,00,000", benefits: ["Food court branding", "Exclusive rights"] },
        ],
        image: "/placeholder.svg?height=300&width=400",
        featured: true,
        trending: false,
        rating: 4.8,
        previousSponsors: ["Coca-Cola", "Red Bull", "Spotify", "Netflix"],
        description: "India's largest college cultural festival featuring international artists and performances.",
        saved: false,
      },
      {
        id: "3",
        name: "Entrepreneurship Summit 2024",
        college: "Indian Institute of Management Ahmedabad",
        location: "Ahmedabad, Gujarat",
        date: "2024-02-10",
        endDate: "2024-02-12",
        attendance: "5,000+",
        type: "Business",
        category: "Management",
        packages: [
          {
            name: "Title Sponsor",
            price: "₹10,00,000",
            benefits: ["Keynote branding", "Networking access", "Panel participation"],
          },
          { name: "Innovation Partner", price: "₹6,00,000", benefits: ["Startup showcase", "Mentorship sessions"] },
          { name: "Workshop Sponsor", price: "₹2,50,000", benefits: ["Workshop branding", "Direct interaction"] },
        ],
        image: "/placeholder.svg?height=300&width=400",
        featured: false,
        trending: true,
        rating: 4.7,
        previousSponsors: ["Sequoia Capital", "Accel Partners", "KPMG", "Deloitte"],
        description: "Premier entrepreneurship event connecting startups, investors, and industry leaders.",
        saved: true,
      },
    ]

    setFestivals(demoFestivals)

    // Load saved festivals
    const saved = demoFestivals.filter((f) => f.saved)
    setSavedFestivals(saved)

    // Load applications
    const storedApplications = localStorage.getItem("myApplications")
    if (storedApplications) {
      setMyApplications(JSON.parse(storedApplications))
    } else {
      const demoApplications: Application[] = [
        {
          id: "1",
          festival: "TechFest 2024",
          college: "ABC Institute of Technology",
          package: "Co-Sponsor",
          amount: "₹2,50,000",
          status: "Under Review",
          appliedDate: "2024-01-15",
        },
        {
          id: "2",
          festival: "Innovation Summit",
          college: "DEF Engineering College",
          package: "Title Sponsor",
          amount: "₹5,00,000",
          status: "Approved",
          appliedDate: "2024-01-10",
        },
      ]
      setMyApplications(demoApplications)
      localStorage.setItem("myApplications", JSON.stringify(demoApplications))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userSession")
    router.push("/")
  }

  const handleSaveFestival = (festivalId: string) => {
    const updatedFestivals = festivals.map((f) => (f.id === festivalId ? { ...f, saved: !f.saved } : f))
    setFestivals(updatedFestivals)
    setSavedFestivals(updatedFestivals.filter((f) => f.saved))
  }

  const handleApplyForSponsorship = () => {
    if (applyDialog.festival && applicationForm.package) {
      const newApplication: Application = {
        id: Date.now().toString(),
        festival: applyDialog.festival.name,
        college: applyDialog.festival.college,
        package: applicationForm.package,
        amount: applyDialog.festival.packages.find((p) => p.name === applicationForm.package)?.price || "",
        status: "Pending",
        appliedDate: new Date().toISOString(),
        message: applicationForm.message,
      }

      const updatedApplications = [...myApplications, newApplication]
      setMyApplications(updatedApplications)
      localStorage.setItem("myApplications", JSON.stringify(updatedApplications))

      // Also add to sponsor applications for college dashboard
      const sponsorApplications = JSON.parse(localStorage.getItem("sponsorApplications") || "[]")
      const sponsorApplication = {
        id: newApplication.id,
        company: "TechCorp Solutions", // This would come from sponsor profile
        industry: "Technology",
        budget: newApplication.amount,
        package: newApplication.package,
        status: "Pending",
        appliedDate: newApplication.appliedDate,
        contactEmail: "sponsor@techcorp.com",
        message: newApplication.message,
      }
      sponsorApplications.push(sponsorApplication)
      localStorage.setItem("sponsorApplications", JSON.stringify(sponsorApplications))

      setApplyDialog({ open: false, festival: null })
      setApplicationForm({ package: "", message: "", budget: "" })

      alert("Application submitted successfully!")
    }
  }

  const filteredFestivals = festivals.filter((festival) => {
    const matchesSearch =
      festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || festival.type.toLowerCase() === selectedType.toLowerCase()
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Trophy className="h-8 w-8 text-green-400" />
              <span className="ml-3 text-2xl font-bold">EventNest</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, TechCorp Solutions</span>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Profile
              </Button>
              <Button onClick={handleLogout} className="bg-green-400 hover:bg-green-500 text-black">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Applications</CardTitle>
              <Building className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{myApplications.length}</div>
              <p className="text-xs text-gray-400">
                {myApplications.filter((app) => app.status === "Pending" || app.status === "Under Review").length}{" "}
                pending review
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Approved Partnerships</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {myApplications.filter((app) => app.status === "Approved").length}
              </div>
              <p className="text-xs text-gray-400">This year</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Investment</CardTitle>
              <Trophy className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹12.5L</div>
              <p className="text-xs text-gray-400">Across all events</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Saved Festivals</CardTitle>
              <Heart className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{savedFestivals.length}</div>
              <p className="text-xs text-gray-400">For future reference</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="discover" className="data-[state=active]:bg-green-400 data-[state=active]:text-black">
              Discover Festivals
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              My Applications ({myApplications.length})
            </TabsTrigger>
            <TabsTrigger
              value="partnerships"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              Active Partnerships
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-green-400 data-[state=active]:text-black">
              Saved Festivals ({savedFestivals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Find Perfect Festivals</CardTitle>
                <CardDescription className="text-gray-400">
                  Search and filter festivals based on your preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search festivals, colleges, or locations..."
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Festival Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                    <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Budget Range" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Budgets</SelectItem>
                      <SelectItem value="50k-1l">₹50K - ₹1L</SelectItem>
                      <SelectItem value="1l-2.5l">₹1L - ₹2.5L</SelectItem>
                      <SelectItem value="2.5l-5l">₹2.5L - ₹5L</SelectItem>
                      <SelectItem value="5l+">₹5L+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-green-400 hover:bg-green-500 text-black">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Festival Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFestivals.map((festival) => (
                <Card
                  key={festival.id}
                  className="bg-gray-900 border-gray-800 hover:border-green-400/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={festival.image || "/placeholder.svg"}
                      alt={festival.name}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => handleSaveFestival(festival.id)}
                    >
                      <Heart className={`h-4 w-4 ${festival.saved ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    {festival.featured && (
                      <Badge className="absolute top-2 left-2 bg-green-400 text-black">Featured</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-white">{festival.name}</h3>
                        <p className="text-sm text-gray-400">{festival.college}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          {festival.location}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(festival.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Users className="h-4 w-4 mr-2" />
                          {festival.attendance} attendees
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-green-400 text-green-400">
                          {festival.type}
                        </Badge>
                        <span className="text-sm font-medium text-yellow-400">★ {festival.rating}</span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-300">Sponsorship Packages:</p>
                        {festival.packages.slice(0, 2).map((pkg, index) => (
                          <p key={index} className="text-xs text-gray-400">
                            • {pkg.name} - {pkg.price}
                          </p>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-400 hover:bg-green-500 text-black"
                          onClick={() => setApplyDialog({ open: true, festival })}
                        >
                          Apply Now
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Applications</h2>
              <Badge className="bg-green-400 text-black">{myApplications.length} Total Applications</Badge>
            </div>

            <div className="space-y-4">
              {myApplications.map((application) => (
                <Card key={application.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-white">{application.festival}</h3>
                          <Badge
                            className={
                              application.status === "Approved"
                                ? "bg-green-400 text-black"
                                : application.status === "Under Review" || application.status === "Pending"
                                  ? "bg-yellow-400 text-black"
                                  : "bg-red-500 text-white"
                            }
                          >
                            {application.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>College: {application.college}</p>
                          <p>Package: {application.package}</p>
                          <p>Amount: {application.amount}</p>
                          <p>Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          View Details
                        </Button>
                        {(application.status === "Under Review" || application.status === "Pending") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {myApplications.length === 0 && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-12 text-center">
                    <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Applications Yet</h3>
                    <p className="text-gray-400 mb-4">
                      Start exploring festivals and apply for sponsorship opportunities.
                    </p>
                    <Button className="bg-green-400 hover:bg-green-500 text-black" asChild>
                      <Link href="#discover">Discover Festivals</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="partnerships" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Active Partnerships</CardTitle>
                <CardDescription className="text-gray-400">Festivals you're currently sponsoring</CardDescription>
              </CardHeader>
              <CardContent>
                {myApplications.filter((app) => app.status === "Approved").length > 0 ? (
                  <div className="space-y-4">
                    {myApplications
                      .filter((app) => app.status === "Approved")
                      .map((partnership) => (
                        <Card key={partnership.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-white">{partnership.festival}</h4>
                                <p className="text-sm text-gray-400">{partnership.college}</p>
                                <p className="text-sm text-gray-400">
                                  {partnership.package} - {partnership.amount}
                                </p>
                              </div>
                              <Badge className="bg-green-400 text-black">Active</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No active partnerships yet</p>
                    <p className="text-sm text-gray-500">Your approved sponsorships will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Saved Festivals</CardTitle>
                <CardDescription className="text-gray-400">Festivals you've bookmarked for later</CardDescription>
              </CardHeader>
              <CardContent>
                {savedFestivals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedFestivals.map((festival) => (
                      <Card key={festival.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-white">{festival.name}</h4>
                              <p className="text-sm text-gray-400">{festival.college}</p>
                              <p className="text-sm text-gray-400">{festival.location}</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-green-400 hover:bg-green-500 text-black"
                              onClick={() => setApplyDialog({ open: true, festival })}
                            >
                              Apply
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No saved festivals yet</p>
                    <p className="text-sm text-gray-500">Save festivals you're interested in for quick access</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Apply Dialog */}
      <Dialog open={applyDialog.open} onOpenChange={(open) => setApplyDialog({ open, festival: null })}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Apply for Sponsorship</DialogTitle>
            <DialogDescription className="text-gray-400">
              Apply to sponsor {applyDialog.festival?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="package" className="text-white">
                Sponsorship Package
              </Label>
              <Select onValueChange={(value) => setApplicationForm({ ...applicationForm, package: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a package" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {applyDialog.festival?.packages.map((pkg) => (
                    <SelectItem key={pkg.name} value={pkg.name}>
                      {pkg.name} - {pkg.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                onClick={() => setApplyDialog({ open: false, festival: null })}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyForSponsorship}
                disabled={!applicationForm.package}
                className="bg-green-400 hover:bg-green-500 text-black"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
