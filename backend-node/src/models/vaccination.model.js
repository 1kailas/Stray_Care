import mongoose from 'mongoose';

const vaccinationRecordSchema = new mongoose.Schema({
  vaccineName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['RABIES', 'DHPP', 'BORDETELLA', 'LEPTOSPIROSIS', 'LYME', 'DEWORMING', 'OTHER'],
    required: true
  },
  dateAdministered: {
    type: Date,
    required: true
  },
  nextDueDate: {
    type: Date
  },
  batchNumber: {
    type: String
  },
  administeredBy: {
    type: String
  },
  notes: {
    type: String
  },
  completed: {
    type: Boolean,
    default: true
  }
});

const vaccinationSchema = new mongoose.Schema({
  dogReportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DogReport'
  },
  dogName: {
    type: String,
    required: true
  },
  dogDescription: {
    type: String
  },
  records: [vaccinationRecordSchema],
  vetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vetName: {
    type: String
  },
  location: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Vaccination = mongoose.model('Vaccination', vaccinationSchema);

export default Vaccination;
