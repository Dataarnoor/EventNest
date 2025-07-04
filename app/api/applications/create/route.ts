import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Application from "@/models/Application";
import Event from "@/models/Event";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'sponsor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    // Validate required fields
    if (!data.event) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // First get the event to find its owner
    const event = await Event.findById(data.event);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Ensure sponsor exists (for robust permission checks)
    const sponsor = await User.findById(session.user.id);
    if (!sponsor) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
    }

    // Check for duplicate applications
    const existingApplication = await Application.findOne({
      sponsor: new mongoose.Types.ObjectId(session.user.id),
      event: new mongoose.Types.ObjectId(data.event)
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this event" },
        { status: 400 }
      );
    }

    // Create application
    const application = await Application.create({
      ...data,
      sponsor: new mongoose.Types.ObjectId(session.user.id),
      event: new mongoose.Types.ObjectId(data.event),
      // Always store eventOwner as string for consistent querying
      eventOwner: event.college?.toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Optionally populate event and sponsor for response
    await application.populate('event');
    await application.populate('sponsor');

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
