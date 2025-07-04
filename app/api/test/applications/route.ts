import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Application from "@/models/Application";

export async function GET(request: Request) {
  try {
    await connectDB();

    // Get counts
    const totalCount = await Application.countDocuments();
    const pendingCount = await Application.countDocuments({ status: 'pending' });
    const applications = await Application.find()
      .populate('sponsor')
      .populate('event')
      .populate('eventOwner');

    return NextResponse.json({
      totalApplications: totalCount,
      pendingApplications: pendingCount,
      applications: applications
    });

  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
