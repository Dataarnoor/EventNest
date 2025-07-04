"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, MapPin, Users, Trophy, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CollegeRegister() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    collegeName: "",
    festivalName: "",
    email: "",
    phone: "",
    location: "",
    festivalDate: "",
    expectedAttendance: "",
    festivalType: "",
    description: "",
    sponsorshipPackages: [] as string[],
    previousSponsors: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      website: "",
    },
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.collegeName.trim()) newErrors.collegeName = "College name is required"
    if (!formData.festivalName.trim()) newErrors.festivalName = "Festival name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.festivalDate) newErrors.festivalDate = "Festival date is required"
    if (!formData.expectedAttendance) newErrors.expectedAttendance = "Expected attendance is required"
    if (!formData.festivalType) newErrors.festivalType = "Festival type is required"
    if (!formData.description.trim()) newErrors.description = "Festival description is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePackageChange = (packageName: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sponsorshipPackages: checked
        ? [...prev.sponsorshipPackages, packageName]
        : prev.sponsorshipPackages.filter((pkg) => pkg !== packageName),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store registration data in localStorage for demo
      const registrationData = {
        ...formData,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString(),
        status: "pending",
      }

      localStorage.setItem("collegeRegistration", JSON.stringify(registrationData))

      // Create user session
      const sessionData = {
        id: registrationData.id,
        email: formData.email,
        type: "college",
        name: formData.collegeName,
        festivalName: formData.festivalName,
      }
      localStorage.setItem("userSession", JSON.stringify(sessionData))

      setSubmitStatus("success")

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push("/college/dashboard")
      }, 2000)
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-12">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Registration Successful!</h1>
          <p className="text-gray-400 mb-4">
            Your festival has been registered successfully. You'll be redirected to your dashboard shortly.
          </p>
          <Button asChild className="bg-green-400 hover:bg-green-500 text-black">
            <Link href="/college/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300 mb-4">
            <Trophy className="h-6 w-6 mr-2" />
            <span className="text-xl font-bold">EventNest</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Register Your College Festival</h1>
          <p className="text-gray-400">Connect with sponsors and make your festival unforgettable</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Festival Registration</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details about your college and upcoming festival
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-300">Registration failed. Please try again.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="collegeName" className="text-white">
                    College Name *
                  </Label>
                  <Input
                    id="collegeName"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    placeholder="Enter your college name"
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${errors.collegeName ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.collegeName && <p className="text-red-400 text-sm mt-1">{errors.collegeName}</p>}
                </div>
                <div>
                  <Label htmlFor="festivalName" className="text-white">
                    Festival Name *
                  </Label>
                  <Input
                    id="festivalName"
                    value={formData.festivalName}
                    onChange={(e) => setFormData({ ...formData, festivalName: e.target.value })}
                    placeholder="Enter festival name"
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${errors.festivalName ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.festivalName && <p className="text-red-400 text-sm mt-1">{errors.festivalName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="festival@college.edu"
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${errors.email ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${errors.phone ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Festival Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="location" className="text-white">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, State"
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${errors.location ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
                </div>
                <div>
                  <Label htmlFor="festivalDate" className="text-white">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Festival Date *
                  </Label>
                  <Input
                    id="festivalDate"
                    type="date"
                    value={formData.festivalDate}
                    onChange={(e) => setFormData({ ...formData, festivalDate: e.target.value })}
                    className={`bg-gray-800 border-gray-700 text-white ${errors.festivalDate ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.festivalDate && <p className="text-red-400 text-sm mt-1">{errors.festivalDate}</p>}
                </div>
                <div>
                  <Label htmlFor="expectedAttendance" className="text-white">
                    <Users className="inline h-4 w-4 mr-1" />
                    Expected Attendance *
                  </Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, expectedAttendance: value })}>
                    <SelectTrigger
                      className={`bg-gray-800 border-gray-700 text-white ${errors.expectedAttendance ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="500-1000">500 - 1,000</SelectItem>
                      <SelectItem value="1000-2500">1,000 - 2,500</SelectItem>
                      <SelectItem value="2500-5000">2,500 - 5,000</SelectItem>
                      <SelectItem value="5000+">5,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.expectedAttendance && (
                    <p className="text-red-400 text-sm mt-1">{errors.expectedAttendance}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="festivalType" className="text-white">
                  Festival Type *
                </Label>
                <Select onValueChange={(value) => setFormData({ ...formData, festivalType: value })}>
                  <SelectTrigger
                    className={`bg-gray-800 border-gray-700 text-white ${errors.festivalType ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select festival type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="cultural">Cultural Festival</SelectItem>
                    <SelectItem value="technical">Technical Festival</SelectItem>
                    <SelectItem value="sports">Sports Festival</SelectItem>
                    <SelectItem value="mixed">Mixed (Cultural + Technical)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.festivalType && <p className="text-red-400 text-sm mt-1">{errors.festivalType}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Festival Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your festival, events, target audience, and what makes it special..."
                  rows={4}
                  className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${errors.description ? "border-red-500" : ""}`}
                  required
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Sponsorship Information */}
              <div>
                <Label className="text-white">Available Sponsorship Packages</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {[
                    "Title Sponsor",
                    "Co-Sponsor",
                    "Event Sponsor",
                    "Food Partner",
                    "Merchandise Partner",
                    "Digital Partner",
                  ].map((pkg) => (
                    <div key={pkg} className="flex items-center space-x-2">
                      <Checkbox
                        id={pkg}
                        checked={formData.sponsorshipPackages.includes(pkg)}
                        onCheckedChange={(checked) => handlePackageChange(pkg, checked as boolean)}
                        className="border-gray-600 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400"
                      />
                      <Label htmlFor={pkg} className="text-sm text-gray-300">
                        {pkg}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="previousSponsors" className="text-white">
                  Previous Sponsors (Optional)
                </Label>
                <Textarea
                  id="previousSponsors"
                  value={formData.previousSponsors}
                  onChange={(e) => setFormData({ ...formData, previousSponsors: e.target.value })}
                  placeholder="List any previous sponsors or partnerships..."
                  rows={2}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Social Media */}
              <div>
                <Label className="text-white">Social Media & Website</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <Input
                    placeholder="Instagram handle"
                    value={formData.socialMedia.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, instagram: e.target.value },
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  <Input
                    placeholder="Facebook page"
                    value={formData.socialMedia.facebook}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, facebook: e.target.value },
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  <Input
                    placeholder="Website URL"
                    value={formData.socialMedia.website}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, website: e.target.value },
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-green-400 hover:bg-green-500 text-black"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register Festival"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  asChild
                >
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
