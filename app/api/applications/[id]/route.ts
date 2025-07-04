import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Application from "@/models/Application";

// ✅ Define the type of context explicitly
type Context = {
  params: {
    id: string;
  };
};

export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session || session.user.userType !== "sponsor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const application = await Application.findOneAndDelete({
      _id: params.id,
      sponsor: session.user.id,
      status: "pending",
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or cannot be deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
