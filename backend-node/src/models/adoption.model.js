import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
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
  dogPhotoUrl: {
    type: String
  },
  adopterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adopterName: {
    type: String,
    required: true
  },
  adopterContact: {
    type: String,
    required: true
  },
  adopterEmail: {
    type: String,
    required: true
  },
  adopterAddress: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED'],
    default: 'PENDING'
  },
  notes: {
    type: String
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: {
    type: Date
  },
  completionDate: {
    type: Date
  }
}, {
  timestamps: true
});

const Adoption = mongoose.model('Adoption', adoptionSchema);

export default Adoption;
