import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Use the new App Router convention for file uploads
export const dynamic = "force-dynamic"; // Ensures this route is always dynamic
export const maxSize = 16 * 1024 * 1024; // Optional: set max upload size (16MB here)

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Parse form data
    const form = formidable({ multiples: false, uploadDir: "./public/uploads", keepExtensions: true });
    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(request as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Prepare event data
    const eventData: any = {
      ...fields,
      college: new mongoose.Types.ObjectId(session.user.id),
      organizerEmail: session.user.email,
      isActive: true,
    };

    // Handle brochure file
    if (files.brochurePdf) {
      const brochureFile = Array.isArray(files.brochurePdf) ? files.brochurePdf[0] : files.brochurePdf;
      eventData.brochurePdf = {
        url: `/uploads/${path.basename(brochureFile.filepath)}`,
        filename: brochureFile.originalFilename,
      };
    }

    const event = await Event.create(eventData);
    return NextResponse.json({ message: "Event created successfully", event }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
  }
}
