import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Application from "@/models/Application";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Current session:", session); // Add logging

    if (!session || session.user.userType !== 'college') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // First check if there are any applications for this college
    const count = await Application.countDocuments({ eventOwner: session.user.id });
    console.log(`Found ${count} applications for college:`, session.user.id);

    const applications = await Application.find({ eventOwner: session.user.id })
      .populate('sponsor', 'companyName email contactPerson')
      .populate('event', 'title date venue')
      .sort({ createdAt: -1 });

    console.log("Applications details:", JSON.stringify(applications, null, 2));

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Fetch college applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications", details: error },
      { status: 500 }
    );
  }
}
