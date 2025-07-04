import { type NextRequest, NextResponse } from "next/server"

// Mock database
const festivals = [
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
    ],
    featured: true,
    trending: true,
    rating: 4.9,
    previousSponsors: ["Google", "Microsoft", "Amazon"],
    description: "Asia's largest technical festival with cutting-edge competitions.",
    createdBy: "iit@bombay.edu",
    views: 1250,
    interested: 45,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const location = searchParams.get("location")
    const search = searchParams.get("search")

    let filteredFestivals = [...festivals]

    // Apply filters
    if (type && type !== "all") {
      filteredFestivals = filteredFestivals.filter((f) => f.type.toLowerCase() === type.toLowerCase())
    }

    if (location && location !== "all") {
      filteredFestivals = filteredFestivals.filter((f) => f.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (search) {
      filteredFestivals = filteredFestivals.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.college.toLowerCase().includes(search.toLowerCase()) ||
          f.location.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({ festivals: filteredFestivals })
  } catch (error) {
    console.error("Festivals fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch festivals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const festivalData = await request.json()

    // Validate session (in real app, verify JWT)
    const sessionCookie = request.cookies.get("session")
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const newFestival = {
      id: Date.now().toString(),
      ...festivalData,
      createdAt: new Date().toISOString(),
      views: 0,
      interested: 0,
      featured: false,
      trending: false,
      rating: 0,
    }

    festivals.push(newFestival)

    return NextResponse.json({
      success: true,
      festival: newFestival,
    })
  } catch (error) {
    console.error("Festival creation error:", error)
    return NextResponse.json({ error: "Failed to create festival" }, { status: 500 })
  }
}
