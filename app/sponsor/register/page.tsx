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
import { Building, Trophy, Target, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SponsorRegister() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    email: "",
    phone: "",
    website: "",
    companySize: "",
    budget: "",
    targetAudience: [] as string[],
    sponsorshipGoals: [] as string[],
    preferredEvents: [] as string[],
    description: "",
    previousSponsorships: "",
    contactPerson: {
      name: "",
      designation: "",
      email: "",
    },
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
    if (!formData.industry) newErrors.industry = "Industry is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.budget) newErrors.budget = "Budget range is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleArrayChange = (array: string[], item: string, checked: boolean, field: keyof typeof formData) => {
    const newArray = checked ? [...array, item] : array.filter((i) => i !== item)

    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
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

      localStorage.setItem("sponsorRegistration", JSON.stringify(registrationData))

      // Create user session
      const sessionData = {
        id: registrationData.id,
        email: formData.email,
        type: "sponsor",
        name: formData.companyName,
        industry: formData.industry,
      }
      localStorage.setItem("userSession", JSON.stringify(sessionData))

      setSubmitStatus("success")

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push("/sponsor/dashboard")
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
            Your company has been registered successfully. You'll be redirected to your dashboard shortly.
          </p>
          <Button asChild className="bg-green-400 hover:bg-green-500 text-black">
            <Link href="/sponsor/dashboard">Go to Dashboard</Link>
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
            <span className="text-xl font-bold">FestConnect</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Register as a Sponsor</h1>
          <p className="text-gray-400">Connect with college festivals and reach your target audience</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Sponsor Registration</CardTitle>
            <CardDescription className="text-gray-400">
              Tell us about your company and sponsorship preferences
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
              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName" className="text-white">
                    <Building className="inline h-4 w-4 mr-1" />
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Enter your company name"
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${errors.companyName ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.companyName && <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>}
                </div>
                <div>
                  <Label htmlFor="industry" className="text-white">
                    Industry *
                  </Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                    <SelectTrigger
                      className={`bg-gray-800 border-gray-700 text-white ${errors.industry ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance & Banking</SelectItem>
                      <SelectItem value="fmcg">FMCG</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="media">Media & Entertainment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.industry && <p className="text-red-400 text-sm mt-1">{errors.industry}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Company Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@company.com"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="website" className="text-white">
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.company.com"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="companySize" className="text-white">
                    Company Size
                  </Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                      <SelectItem value="small">Small (51-200 employees)</SelectItem>
                      <SelectItem value="medium">Medium (201-1000 employees)</SelectItem>
                      <SelectItem value="large">Large (1000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sponsorship Preferences */}
              <div>
                <Label htmlFor="budget" className="text-white">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Sponsorship Budget Range *
                </Label>
                <Select onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                  <SelectTrigger
                    className={`bg-gray-800 border-gray-700 text-white ${errors.budget ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                    <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                    <SelectItem value="1l-2.5l">₹1,00,000 - ₹2,50,000</SelectItem>
                    <SelectItem value="2.5l-5l">₹2,50,000 - ₹5,00,000</SelectItem>
                    <SelectItem value="5l+">₹5,00,000+</SelectItem>
                  </SelectContent>
                </Select>
                {errors.budget && <p className="text-red-400 text-sm mt-1">{errors.budget}</p>}
              </div>

              <div>
                <Label className="text-white">
                  <Target className="inline h-4 w-4 mr-1" />
                  Target Audience
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {[
                    "Engineering Students",
                    "Management Students",
                    "Arts Students",
                    "Science Students",
                    "All Students",
                    "Young Professionals",
                  ].map((audience) => (
                    <div key={audience} className="flex items-center space-x-2">
                      <Checkbox
                        id={audience}
                        checked={formData.targetAudience.includes(audience)}
                        onCheckedChange={(checked) =>
                          handleArrayChange(formData.targetAudience, audience, checked as boolean, "targetAudience")
                        }
                        className="border-gray-600 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400"
                      />
                      <Label htmlFor={audience} className="text-sm text-gray-300">
                        {audience}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white">Sponsorship Goals</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {[
                    "Brand Awareness",
                    "Lead Generation",
                    "Product Launch",
                    "Recruitment",
                    "CSR Initiative",
                    "Market Research",
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.sponsorshipGoals.includes(goal)}
                        onCheckedChange={(checked) =>
                          handleArrayChange(formData.sponsorshipGoals, goal, checked as boolean, "sponsorshipGoals")
                        }
                        className="border-gray-600 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400"
                      />
                      <Label htmlFor={goal} className="text-sm text-gray-300">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white">Preferred Event Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {[
                    "Cultural Festivals",
                    "Technical Festivals",
                    "Sports Events",
                    "Hackathons",
                    "Business Competitions",
                    "Art & Design",
                  ].map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Checkbox
                        id={event}
                        checked={formData.preferredEvents.includes(event)}
                        onCheckedChange={(checked) =>
                          handleArrayChange(formData.preferredEvents, event, checked as boolean, "preferredEvents")
                        }
                        className="border-gray-600 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400"
                      />
                      <Label htmlFor={event} className="text-sm text-gray-300">
                        {event}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Company Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about your company, products/services, and what you're looking for in sponsorship partnerships..."
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="previousSponsorships" className="text-white">
                  Previous Sponsorships (Optional)
                </Label>
                <Textarea
                  id="previousSponsorships"
                  value={formData.previousSponsorships}
                  onChange={(e) => setFormData({ ...formData, previousSponsorships: e.target.value })}
                  placeholder="List any previous event sponsorships or partnerships..."
                  rows={2}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Contact Person */}
              <div>
                <Label className="text-white">Primary Contact Person</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <Input
                    placeholder="Full Name"
                    value={formData.contactPerson.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: { ...formData.contactPerson, name: e.target.value },
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  <Input
                    placeholder="Designation"
                    value={formData.contactPerson.designation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: { ...formData.contactPerson, designation: e.target.value },
                      })
                    }
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={formData.contactPerson.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: { ...formData.contactPerson, email: e.target.value },
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
                  {isSubmitting ? "Registering..." : "Register as Sponsor"}
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
