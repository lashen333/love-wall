// src\lib\models\Couple.ts
import mongoose from 'mongoose';

const coupleSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  names: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true,
  },
  weddingDate: {
    type: Date,
    required: false,
  },
  country: {
    type: String,
    required: false,
    trim: true,
  },
  story: {
    type: String,
    required: false,
    maxlength: 500,
    trim: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  thumbUrl: {
    type: String,
    required: true,
  },
  secretCode: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true,
  },
  paymentId: {
    type: String,
    required: true,
    index: true,
  },
}, {
  timestamps: true,
});

coupleSchema.index({ status: 1, createdAt: -1 });
coupleSchema.index({ secretCode: 1, names: 1 });

coupleSchema.virtual('formattedWeddingDate').get(function() {
  if (!this.weddingDate) return null;
  return this.weddingDate.toLocaleDateString();
});

coupleSchema.set('toJSON', { virtuals: true });
coupleSchema.set('toObject', { virtuals: true });

export default mongoose.models.Couple || mongoose.model('Couple', coupleSchema);
