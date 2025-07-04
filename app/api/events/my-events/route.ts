import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch events where the organizerEmail matches the logged-in user's email
    const events = await Event.find({ organizerEmail: session.user.email });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
