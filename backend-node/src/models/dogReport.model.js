import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  addedBy: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const dogReportSchema = new mongoose.Schema({
  dogName: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  condition: {
    type: String,
    enum: ['HEALTHY', 'INJURED', 'SICK', 'MALNOURISHED', 'CRITICAL'],
    required: true
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  photoUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESCUED', 'COMPLETED', 'CLOSED'],
    default: 'PENDING'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reporterName: {
    type: String,
    required: true
  },
  reporterContact: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  assignedVolunteerName: {
    type: String
  },
  notes: [noteSchema],
  tags: [String],
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  rescueDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for geospatial queries
dogReportSchema.index({ coordinates: '2dsphere' });

const DogReport = mongoose.model('DogReport', dogReportSchema, 'dog_reports');

export default DogReport;
