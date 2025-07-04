import connectDB from "@/lib/db";
import Event from "@/models/Event";

async function setOrganizerEmailForAllEvents(email: string) {
  await connectDB();
  const result = await Event.updateMany({}, { $set: { organizerEmail: email } });
  console.log(`All events updated with organizerEmail: ${email}`);
  console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  process.exit(0);
}

// Get email from command line argument or fallback to a default
const email = process.argv[2] || "your@email.com";
setOrganizerEmailForAllEvents(email);
