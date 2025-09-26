// src\types\index.ts
export interface Couple {
  _id: string;
  slug: string;
  names: string;
  weddingDate?: Date;
  country?: string;
  story?: string;
  photoUrl: string;
  thumbUrl: string;
  secretCode: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  coupleId: string;
  createdAt: Date;
}

export interface UploadFormData {
  names: string;
  email:string;
  weddingDate?: string;
  country?: string;
  story: string;
  photo: File | Blob | null;
}
// Email-related types
export interface EmailRequest {
  email: string;
  secretCode: string;
  names: string;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface HeartTile {
  x: number;
  y: number;
  couple?: Couple;
  isEmpty: boolean;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

