import mongoose from 'mongoose';

const adoptionDogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dog name is required'],
    trim: true
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: Number, // in months
    min: 0
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'UNKNOWN'],
    required: true
  },
  size: {
    type: String,
    enum: ['SMALL', 'MEDIUM', 'LARGE'],
    required: true
  },
  description: {
    type: String
  },
  photos: [String],
  healthStatus: {
    type: String
  },
  vaccinated: {
    type: Boolean,
    default: false
  },
  neutered: {
    type: Boolean,
    default: false
  },
  temperament: {
    type: String
  },
  goodWithKids: {
    type: Boolean,
    default: false
  },
  goodWithPets: {
    type: Boolean,
    default: false
  },
  specialNeeds: {
    type: String
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'PENDING', 'ADOPTED'],
    default: 'AVAILABLE'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update updatedDate on save
adoptionDogSchema.pre('save', function(next) {
  this.updatedDate = new Date();
  next();
});

const AdoptionDog = mongoose.model('AdoptionDog', adoptionDogSchema, 'adoption_dogs');

export default AdoptionDog;
