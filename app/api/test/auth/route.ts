import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      userType: user.userType,
      hasPassword: !!user.password,
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
