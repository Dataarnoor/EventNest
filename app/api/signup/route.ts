import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Debug logs
    console.log("Signup attempt:", {
      email: data.email,
      userType: data.userType,
      hasPassword: !!data.password
    });

    // Check if user exists
    const existingUser = await User.findOne({ 
      email: data.email.toLowerCase() 
    });

    if (existingUser) {
      console.log("User already exists:", data.email);
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await User.create({
      ...data,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("User created successfully:", {
      id: user._id,
      email: user.email,
      userType: user.userType
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
