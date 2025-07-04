import mongoose, { Schema } from 'mongoose';

const ApplicationSchema = new Schema({
  sponsor: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  event: { 
    type: Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  package: {
    type: String,
    required: false
  },
  message: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
export default Application;
