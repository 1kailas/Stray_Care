import mongoose from 'mongoose';

const volunteerTaskSchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  volunteerName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  dueDate: {
    type: String // ISO date string
  },
  assignedDate: {
    type: String // ISO date string
  },
  completedDate: {
    type: String // ISO date string
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for queries
volunteerTaskSchema.index({ volunteerId: 1, status: 1 });

const VolunteerTask = mongoose.model('VolunteerTask', volunteerTaskSchema, 'volunteer_tasks');

export default VolunteerTask;
