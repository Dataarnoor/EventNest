import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "Database connected successfully" });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: "Database connection failed", details: error }, 
      { status: 500 }
    );
  }
}
