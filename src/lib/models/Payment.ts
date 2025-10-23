import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  polarSessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: 'usd',
    enum: ['usd', 'eur', 'gbp'],
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'], 
    default: 'created',
    index: true,
  },
  coupleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Couple',
    required: false,
  },
  metadata: {
    type: Map,
    of: String,
    default: {},
  },
}, {
  timestamps: true,
});

// Indexes remain the same
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ coupleId: 1 });

// Virtual for formatted amount (unchanged)
paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency.toUpperCase(),
  }).format(this.amount / 100); // Polar amounts in cents too
});

paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);