import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);
    
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'college') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const eventId = params.id;
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'college') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    
    const event = await Event.findOneAndUpdate(
      {
        _id: params.id,
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
  return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
}
