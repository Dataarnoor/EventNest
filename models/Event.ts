import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  city: String,
  expectedAttendance: Number,
  sponsorshipTiers: String,
  eventTypes: [String],
  budgetRange: String,
  brochurePdf: {
    url: String,
    filename: String
  },
  college: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true // Make college required
  },
  organizerEmail: String,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  strict: false
});

// Add this index to improve query performance
EventSchema.index({ college: 1 });

delete mongoose.models['Event'];
const Event = mongoose.model('Event', EventSchema);
export default Event;
