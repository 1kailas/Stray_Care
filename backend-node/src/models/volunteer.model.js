import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Contact is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  area: {
    type: String,
    required: [true, 'Area is required']
  },
  role: {
    type: String,
    enum: ['FEEDER', 'RESCUER', 'VET', 'TRANSPORT', 'FOSTER'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'ACTIVE', 'INACTIVE', 'REJECTED'],
    default: 'PENDING'
  },
  assignedCases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DogReport'
  }],
  completedCases: {
    type: Number,
    default: 0
  },
  availability: {
    type: String
  },
  address: {
    type: String
  },
  experience: {
    type: String
  },
  certifications: {
    type: String
  }
}, {
  timestamps: true
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;
