import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  await connectDB();
  // Adjust the filter as per your schema (e.g., userType: "college")
  const colleges = await User.find({ userType: "college" }, { _id: 1, name: 1 });
  return NextResponse.json({ colleges });
}
