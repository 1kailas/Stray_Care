import mongoose from 'mongoose';

const adoptionRequestSchema = new mongoose.Schema({
  dogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdoptionDog',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  livingSpace: {
    type: String,
    enum: ['APARTMENT', 'HOUSE', 'FARM'],
    required: true
  },
  hasYard: {
    type: Boolean,
    default: false
  },
  hasPets: {
    type: Boolean,
    default: false
  },
  petDetails: {
    type: String
  },
  hasChildren: {
    type: Boolean,
    default: false
  },
  childrenAges: {
    type: String
  },
  experienceWithDogs: {
    type: String
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  reviewedDate: {
    type: Date
  }
}, {
  timestamps: true
});

const AdoptionRequest = mongoose.model('AdoptionRequest', adoptionRequestSchema, 'adoption_requests');

export default AdoptionRequest;
