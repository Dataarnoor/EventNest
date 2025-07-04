"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, Eye, MessageSquare, Plus, Edit, Trophy, CheckCircle, X, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SponsorApplication {
  id: string
  company: string
  industry: string
  budget: string
  package: string
  status: "Pending" | "Approved" | "Rejected" | "Under Review"
  appliedDate: string
  contactEmail: string
  message?: string
}

interface FestivalData {
  id: string
  name: string
  college: string
  date: string
  status: string
  views: number
  interested: number
  applications: number
  description: string
  location: string
  expectedAttendance: string
  festivalType: string
  sponsorshipPackages: string[]
}

export default function CollegeDashboard() {
  const router = useRouter()
  const [festivalData, setFestivalData] = useState<FestivalData | null>(null)
  const [sponsorApplications, setSponsorApplications] = useState<SponsorApplication[]>([])
  const [isEditingFestival, setIsEditingFestival] = useState(false)
  const [editForm, setEditForm] = useState<Partial<FestivalData>>({})
  const [messageDialog, setMessageDialog] = useState<{ open: boolean; application: SponsorApplication | null }>({
    open: false,
    application: null,
  })
  const [messageText, setMessageText] = useState("")

  useEffect(() => {
    // Load festival data without redirect logic
    const storedFestival = localStorage.getItem("collegeRegistration")
    if (storedFestival) {
      const festival = JSON.parse(storedFestival)
      const festivalWithStats: FestivalData = {
        id: festival.id || "1",
        name: festival.festivalName || "TechFest 2024",
        college: festival.collegeName || "ABC Institute of Technology",
        date: festival.festivalDate || "2024-03-15",
        status: "Active",
        views: Math.floor(Math.random() * 2000) + 500,
        interested: Math.floor(Math.random() * 50) + 10,
        applications: 0,
        description: festival.description || "An amazing technical festival",
        location: festival.location || "Mumbai, Maharashtra",
        expectedAttendance: festival.expectedAttendance || "2500-5000",
        festivalType: festival.festivalType || "technical",
        sponsorshipPackages: festival.sponsorshipPackages || [],
      }
      setFestivalData(festivalWithStats)
      setEditForm(festivalWithStats)
    } else {
      // Set default data if no registration found
      const defaultFestival: FestivalData = {
        id: "1",
        name: "TechFest 2024",
        college: "ABC Institute of Technology",
        date: "2024-03-15",
        status: "Active",
        views: 1250,
        interested: 35,
        applications: 0,
        description: "An amazing technical festival showcasing innovation and technology",
        location: "Mumbai, Maharashtra",
        expectedAttendance: "2500-5000",
        festivalType: "technical",
        sponsorshipPackages: ["Title Sponsor", "Co-Sponsor", "Event Sponsor"],
      }
      setFestivalData(defaultFestival)
      setEditForm(defaultFestival)
    }

    // Load sponsor applications
    const storedApplications = localStorage.getItem("sponsorApplications")
    if (storedApplications) {
      const applications = JSON.parse(storedApplications)
      setSponsorApplications(applications)
    } else {
      // Demo applications
      const demoApplications: SponsorApplication[] = [
        {
          id: "1",
          company: "TechCorp Solutions",
          industry: "Technology",
          budget: "₹2,50,000",
          package: "Title Sponsor",
          status: "Pending",
          appliedDate: "2024-01-15",
          contactEmail: "sponsor@techcorp.com",
        },
        {
          id: "2",
          company: "Digital Marketing Pro",
          industry: "Marketing",
          budget: "₹75,000",
          package: "Digital Partner",
          status: "Approved",
          appliedDate: "2024-01-12",
          contactEmail: "contact@digitalmarketing.com",
        },
        {
          id: "3",
          company: "Food Junction",
          industry: "F&B",
          budget: "₹50,000",
          package: "Food Partner",
          status: "Under Review",
          appliedDate: "2024-01-10",
          contactEmail: "partnerships@foodjunction.com",
        },
      ]
      setSponsorApplications(demoApplications)
      localStorage.setItem("sponsorApplications", JSON.stringify(demoApplications))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userSession")
    router.push("/")
  }

  const handleApplicationAction = (applicationId: string, action: "approve" | "reject") => {
    const updatedApplications = sponsorApplications.map((app) =>
      app.id === applicationId
        ? { ...app, status: action === "approve" ? ("Approved" as const) : ("Rejected" as const) }
        : app,
    )
    setSponsorApplications(updatedApplications)
    localStorage.setItem("sponsorApplications", JSON.stringify(updatedApplications))
  }

  const handleSaveFestival = () => {
    if (festivalData && editForm) {
      const updatedFestival = { ...festivalData, ...editForm }
      setFestivalData(updatedFestival)

      // Update localStorage
      const storedData = localStorage.getItem("collegeRegistration")
      if (storedData) {
        const data = JSON.parse(storedData)
        const updatedData = {
          ...data,
          festivalName: updatedFestival.name,
          collegeName: updatedFestival.college,
          festivalDate: updatedFestival.date,
          description: updatedFestival.description,
          location: updatedFestival.location,
          expectedAttendance: updatedFestival.expectedAttendance,
          festivalType: updatedFestival.festivalType,
        }
        localStorage.setItem("collegeRegistration", JSON.stringify(updatedData))
      }

      setIsEditingFestival(false)
    }
  }

  const handleSendMessage = () => {
    if (messageDialog.application && messageText.trim()) {
      // In a real app, this would send an email or notification
      console.log(`Message sent to ${messageDialog.application.company}: ${messageText}`)
      setMessageText("")
      setMessageDialog({ open: false, application: null })

      // Show success feedback (you could add a toast notification here)
      alert("Message sent successfully!")
    }
  }

  const getDaysToEvent = (dateString: string) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (!festivalData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

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
              <span className="text-gray-300">Welcome, {festivalData.college}</span>
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
              <CardTitle className="text-sm font-medium text-gray-300">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{festivalData.views.toLocaleString()}</div>
              <p className="text-xs text-gray-400">+12% from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Interested Sponsors</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{festivalData.interested}</div>
              <p className="text-xs text-gray-400">+3 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Applications</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{sponsorApplications.length}</div>
              <p className="text-xs text-gray-400">
                {sponsorApplications.filter((app) => app.status === "Pending").length} pending review
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Days to Event</CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getDaysToEvent(festivalData.date)}</div>
              <p className="text-xs text-gray-400">{new Date(festivalData.date).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-400 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-black"
            >
              Sponsor Applications ({sponsorApplications.length})
            </TabsTrigger>
            <TabsTrigger value="festival" className="data-[state=active]:bg-green-400 data-[state=active]:text-black">
              Festival Details
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-400 data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Festival Status</CardTitle>
                  <CardDescription className="text-gray-400">Current status of your festival listing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">{festivalData.name}</span>
                    <Badge className="bg-green-400 text-black">{festivalData.status}</Badge>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>College: {festivalData.college}</p>
                    <p>Date: {new Date(festivalData.date).toLocaleDateString()}</p>
                    <p>Location: {festivalData.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      onClick={() => setIsEditingFestival(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </Button>
                    <Button size="sm" className="bg-green-400 hover:bg-green-500 text-black" asChild>
                      <Link href="/sponsorships">
                        <Eye className="h-4 w-4 mr-2" />
                        View Public Page
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">Latest updates on your festival</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sponsorApplications.slice(0, 3).map((app, index) => (
                      <div key={app.id} className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            app.status === "Approved"
                              ? "bg-green-400"
                              : app.status === "Pending"
                                ? "bg-yellow-400"
                                : "bg-blue-400"
                          }`}
                        ></div>
                        <div className="text-sm">
                          <p className="font-medium text-white">
                            {app.status === "Approved"
                              ? "Partnership approved"
                              : app.status === "Pending"
                                ? "New sponsor application"
                                : "Application under review"}
                          </p>
                          <p className="text-gray-400">
                            {app.company} - {app.package}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Sponsor Applications</h2>
              <Button className="bg-green-400 hover:bg-green-500 text-black">
                <Plus className="h-4 w-4 mr-2" />
                Invite Sponsors
              </Button>
            </div>

            <div className="space-y-4">
              {sponsorApplications.map((application) => (
                <Card key={application.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-white">{application.company}</h3>
                          <Badge
                            className={
                              application.status === "Approved"
                                ? "bg-green-400 text-black"
                                : application.status === "Pending"
                                  ? "bg-yellow-400 text-black"
                                  : application.status === "Rejected"
                                    ? "bg-red-500 text-white"
                                    : "bg-blue-400 text-black"
                            }
                          >
                            {application.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>Industry: {application.industry}</p>
                          <p>Budget: {application.budget}</p>
                          <p>Package: {application.package}</p>
                          <p>Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
                          <p>Contact: {application.contactEmail}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {application.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                              onClick={() => handleApplicationAction(application.id, "reject")}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-400 hover:bg-green-500 text-black"
                              onClick={() => handleApplicationAction(application.id, "approve")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          onClick={() => setMessageDialog({ open: true, application })}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sponsorApplications.length === 0 && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Applications Yet</h3>
                    <p className="text-gray-400 mb-4">
                      Sponsor applications will appear here once they start applying.
                    </p>
                    <Button className="bg-green-400 hover:bg-green-500 text-black">
                      <Plus className="h-4 w-4 mr-2" />
                      Invite Sponsors
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="festival" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Festival Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your festival details and sponsorship packages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingFestival ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-name" className="text-white">
                          Festival Name
                        </Label>
                        <Input
                          id="edit-name"
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-date" className="text-white">
                          Festival Date
                        </Label>
                        <Input
                          id="edit-date"
                          type="date"
                          value={editForm.date || ""}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-description" className="text-white">
                        Description
                      </Label>
                      <Textarea
                        id="edit-description"
                        value={editForm.description || ""}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={3}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveFestival} className="bg-green-400 hover:bg-green-500 text-black">
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        onClick={() => setIsEditingFestival(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-white">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-300">
                          <strong>Name:</strong> {festivalData.name}
                        </p>
                        <p className="text-gray-300">
                          <strong>College:</strong> {festivalData.college}
                        </p>
                        <p className="text-gray-300">
                          <strong>Date:</strong> {new Date(festivalData.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-300">
                          <strong>Location:</strong> {festivalData.location}
                        </p>
                        <p className="text-gray-300">
                          <strong>Expected Attendance:</strong> {festivalData.expectedAttendance}
                        </p>
                        <p className="text-gray-300">
                          <strong>Type:</strong> {festivalData.festivalType}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-white">Description</h4>
                      <p className="text-sm text-gray-400">{festivalData.description}</p>
                    </div>
                  </div>
                )}

                {!isEditingFestival && (
                  <Button
                    onClick={() => setIsEditingFestival(true)}
                    className="bg-green-400 hover:bg-green-500 text-black"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Festival Details
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">View Analytics</CardTitle>
                  <CardDescription className="text-gray-400">
                    How sponsors are discovering your festival
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Direct visits</span>
                      <span className="font-medium text-green-400">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Search results</span>
                      <span className="font-medium text-green-400">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Recommendations</span>
                      <span className="font-medium text-green-400">25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Sponsor Interest</CardTitle>
                  <CardDescription className="text-gray-400">
                    Industries showing interest in your festival
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Technology</span>
                      <span className="font-medium text-green-400">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">FMCG</span>
                      <span className="font-medium text-green-400">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Finance</span>
                      <span className="font-medium text-green-400">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Others</span>
                      <span className="font-medium text-green-400">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Message Dialog */}
      <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ open, application: null })}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Send Message to {messageDialog.application?.company}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Send a message to {messageDialog.application?.contactEmail}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message" className="text-white">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                onClick={() => setMessageDialog({ open: false, application: null })}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="bg-green-400 hover:bg-green-500 text-black"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
