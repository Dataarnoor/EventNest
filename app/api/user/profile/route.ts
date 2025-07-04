import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

export async function GET_WISHLIST(req) {
  // Get the user's wishlist events
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  await connectDB();
  const user = await User.findOne({ email: session.user.email }).populate('wishlist');
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }
  return new Response(JSON.stringify({ wishlist: user.wishlist }), { status: 200 });
}

export async function POST_WISHLIST(req) {
  // Add an event to the user's wishlist
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { eventId } = await req.json();
  if (!eventId) {
    return new Response(JSON.stringify({ error: 'Missing eventId' }), { status: 400 });
  }
  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }
  if (!user.wishlist.includes(eventId)) {
    user.wishlist.push(eventId);
    await user.save();
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function DELETE_WISHLIST(req) {
  // Remove an event from the user's wishlist
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { eventId } = await req.json();
  if (!eventId) {
    return new Response(JSON.stringify({ error: 'Missing eventId' }), { status: 400 });
  }
  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }
  user.wishlist = user.wishlist.filter((id) => id.toString() !== eventId);
  await user.save();
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
