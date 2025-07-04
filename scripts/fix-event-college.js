const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../lib/db.ts').default;
const Event = require('../models/Event').default;

const COLLEGE_ID = '686717fc3ad927dc90cf12e7'; // your college user ObjectId

async function main() {
  await connectDB();

  // Update all events to belong to this college
  const result = await Event.updateMany(
    {}, // update all events; add a filter if needed
    { $set: { college: COLLEGE_ID } }
  );

  console.log('Updated events:', result);
  mongoose.disconnect();
}

main(); 