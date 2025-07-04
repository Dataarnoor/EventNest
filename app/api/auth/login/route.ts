import { type NextRequest, NextResponse } from "next/server"

// Demo credentials
const DEMO_CREDENTIALS = {
  college: {
    email: "college@example.com",
    password: "password123",
    user: {
      id: "college_1",
      email: "college@example.com",
      type: "college",
      name: "ABC Institute of Technology",
      festivalName: "TechFest 2024",
    },
  },
  sponsor: {
    email: "sponsor@company.com",
    password: "password123",
    user: {
      id: "sponsor_1",
      email: "sponsor@company.com",
      type: "sponsor",
      name: "TechCorp Solutions",
      industry: "Technology",
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, type } = await request.json()

    // Validate input
    if (!email || !password || !type) {
      return NextResponse.json({ error: "Email, password, and type are required" }, { status: 400 })
    }

    if (type !== "college" && type !== "sponsor") {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 })
    }

    // Check demo credentials
    const demoAccount = DEMO_CREDENTIALS[type as keyof typeof DEMO_CREDENTIALS]

    if (email === demoAccount.email && password === demoAccount.password) {
      // Create session token (in production, use proper JWT)
      const sessionToken = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const response = NextResponse.json({
        success: true,
        user: demoAccount.user,
        token: sessionToken,
      })

      // Set HTTP-only cookie for session
      response.cookies.set("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return response
    }

    // Invalid credentials
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
