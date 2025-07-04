import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Application from "@/models/Application";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'college') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const { status } = await request.json();
    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    const application = await Application.findOneAndUpdate(
      { _id: id, eventOwner: session.user.id },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Update application status error:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}
