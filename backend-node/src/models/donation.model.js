import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  donorName: {
    type: String,
    required: [true, 'Donor name is required']
  },
  donorEmail: {
    type: String,
    required: [true, 'Donor email is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'PAYPAL', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER'],
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  purpose: {
    type: String,
    default: 'General'
  },
  message: {
    type: String
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  taxReceiptSent: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
