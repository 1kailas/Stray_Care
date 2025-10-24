import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 0
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'UNKNOWN']
  },
  color: {
    type: String
  },
  size: {
    type: String,
    enum: ['SMALL', 'MEDIUM', 'LARGE']
  },
  description: {
    type: String
  },
  photos: [String],
  location: {
    type: String
  },
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
  microchipped: {
    type: Boolean,
    default: false
  },
  temperament: {
    type: String
  },
  specialNeeds: {
    type: String
  },
  status: {
    type: String,
    enum: ['STRAY', 'RESCUED', 'FOSTERED', 'ADOPTED', 'DECEASED'],
    default: 'STRAY'
  },
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DogReport'
  },
  rescuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rescueDate: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Dog = mongoose.model('Dog', dogSchema);

export default Dog;
