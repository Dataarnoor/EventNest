import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import mongoose from "mongoose";

function extractIdFromRequest(request: Request) {
  // /api/events/[id] => get id from the end of the path
  // @ts-ignore
  const pathname = request.nextUrl?.pathname || "";
  return pathname.split("/").pop();
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const id = extractIdFromRequest(request);
    const event = await Event.findById(id);
    
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'college') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const eventId = extractIdFromRequest(request);
    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const event = await Event.findOneAndDelete({
      _id: eventId,
      college: new mongoose.Types.ObjectId(session.user.id)
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'college') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    const id = extractIdFromRequest(request);
    
    const event = await Event.findOneAndUpdate(
      {
        _id: id,
        college: new mongoose.Types.ObjectId(session.user.id)
      },
      { 
        $set: {
          ...data,
          expectedAttendance: parseInt(data.expectedAttendance),
          updatedAt: new Date()
        } 
      },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}
