import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    console.log('Signup request received:', { ...body, password: '[REDACTED]' });

    const { name, email, password, userType } = body;

    // Basic validation
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to database
    connection = await connectDB();
    console.log('Database connected');

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      userType,
      location: body.location?.trim() || '',
      contactPerson: body.contactPerson?.trim() || '',
      phoneNumber: body.phoneNumber?.trim() || '',
    });

    await user.save();
    console.log('User created:', user._id);

    return NextResponse.json({
      success: true,
      message: "Account created successfully"
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Specific error messages
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: "Invalid input data", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
