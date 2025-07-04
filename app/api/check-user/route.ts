import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    const existingUser = await User.findOne({ email });
    
    return NextResponse.json({ 
      exists: !!existingUser 
    });
  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 }
    );
  }
}
