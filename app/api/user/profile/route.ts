import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Event from '@/models/Event';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate input data
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // Whitelist allowed fields to update
    const allowedFields = ['name', 'email', 'bio', 'avatar'];
    const sanitizedData = Object.keys(data)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => ({...obj, [key]: data[key]}), {});

    if (Object.keys(sanitizedData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { 
        $set: {
          ...sanitizedData,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Profile update error:", error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: "Validation error", details: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
