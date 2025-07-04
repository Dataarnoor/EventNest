import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    return NextResponse.json({
      success: true,
      isValidPassword: isValid,
      userExists: true,
      userType: user.userType
    });
  } catch (error) {
    console.error("Test auth error:", error);
    return NextResponse.json({ error: "Auth test failed" }, { status: 500 });
  }
}
