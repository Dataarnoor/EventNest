import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Application from "@/models/Application";
import Event from "@/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let applications = [];
    if (session.user.userType === 'college') {
      // Get all events created by this college
      const events = await Event.find({ college: session.user.id }, { _id: 1, title: 1, college: 1 });
      const eventIds = events.map(e => e._id);
      console.log('College user:', session.user.id);
      console.log('Events found for this college:', events);

      // Log all applications and their event references for debugging
      const allApplications = await Application.find({});
      console.log('All applications in DB:', allApplications);

      // For each application, log the event and its college
      for (const app of allApplications) {
        const appEvent = await Event.findById(app.event);
        console.log(`Application ${app._id} -> event:`, appEvent ? { _id: appEvent._id, college: appEvent.college, eventId: app.event } : null);
      }

      if (eventIds.length === 0) {
        console.log('No events found for this college.');
        return NextResponse.json({ applications: [] });
      }

      // Get all applications for these events
      applications = await Application.find({ event: { $in: eventIds } })
        .populate({
          path: 'event',
          select: 'title date venue sponsorshipTiers description eventTypes budgetRange college'
        })
        .sort('-createdAt');

      // Extra debug: show which eventIds are being matched
      console.log('Matching eventIds:', eventIds);
      console.log('Applications found for these events:', applications.length);
      applications.forEach(app => {
        console.log(`Application ${app._id} event:`, app.event ? app.event._id : null);
      });
      console.log('Applications details:', applications);
    } else {
      // For sponsors: find their own applications
      applications = await Application.find({ sponsorEmail: session.user.email })
        .populate({
          path: 'event',
          select: 'title date venue sponsorshipTiers description eventTypes budgetRange college'
        })
        .sort('-createdAt');
      console.log('Sponsor applications found:', applications.length);
      console.log('Applications details:', applications);
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, status } = await request.json();

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { $set: { status } },
      { new: true }
    );

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}
