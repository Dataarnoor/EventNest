import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    
    const eventData = {
      ...body,
      college: new mongoose.Types.ObjectId(session.user.id),
      organizerEmail: session.user.email,
      isActive: true
    };

    const event = await Event.create(eventData);
    return NextResponse.json({ message: "Event created successfully", event }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
