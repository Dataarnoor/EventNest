import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Application from "@/models/Application";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'sponsor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const applications = await Application.find({ sponsor: session.user.id })
      .populate('event', 'title date venue')
      .sort({ createdAt: -1 });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
