import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('college', 'name location');
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
