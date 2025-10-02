// src/components/upload-form/steps/DetailsStep.tsx
'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Mail, Phone } from 'lucide-react';
import type { UploadFormData } from '@/types';

export default function DetailsStep({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: UploadFormData;
  setFormData: (updater: (prev: UploadFormData) => UploadFormData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.names.trim()) {
      newErrors.names = 'Names are required';
    }

    // At least one contact method is required
    const hasEmail = formData.email.trim();
    const hasPhone = formData.phoneNumber.trim();

    if (!hasEmail && !hasPhone) {
      newErrors.contact = 'Please provide at least one contact method';
    }

    // Validate email if provided
    if (hasEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate phone number if provided
    if (hasPhone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const hasContactMethod = formData.email.trim() || formData.phoneNumber.trim();
  const canContinue = formData.names.trim() && hasContactMethod && !errors.names && !errors.email && !errors.phoneNumber && !errors.contact;

  return (
    <div>
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full grid place-items-center mx-auto mb-5 sm:mb-6">
          <User className="w-10 h-10 sm:w-12 sm:h-12 text-pink-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Tell Us About Your Love Story</h3>
        <p className="text-gray-600">Add some details to make your photo special</p>
      </div>

      <div className="space-y-5 sm:space-y-6 max-w-md mx-auto">
        {/* Names Field - Required */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Names *</label>
          <input
            type="text"
            value={formData.names}
            onChange={(e) => updateField('names', e.target.value)}
            placeholder="e.g., Sarah & Michael"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              errors.names ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.names && (
            <p className="text-red-500 text-xs mt-1">{errors.names}</p>
          )}
        </div>

        {/* Contact Methods Section */}
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How would you like to receive your secret code?</h4>
            <p className="text-sm text-gray-600">Choose at least one method</p>
          </div>

          {/* Email Field - Optional */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 mr-2 text-pink-500" />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number Field - Optional */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 mr-2 text-green-500" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
              placeholder="+1234567890 or 1234567890"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              📱 Your phone number will be stored for contact purposes
            </p>
          </div>

          {/* Contact Method Error */}
          {errors.contact && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.contact}</p>
            </div>
          )}
        </div>

        {/* Wedding Date - Optional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
          <input
            type="date"
            value={formData.weddingDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, weddingDate: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Country - Optional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
            placeholder="e.g., United States"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Love Story - Optional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Story (Optional)</label>
          <textarea
            value={formData.story}
            onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
            placeholder="Share a brief story about your love journey..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.story.length}/500 characters</p>
        </div>
      </div>

      {/* Required fields notice */}
      <div className="text-xs text-gray-500 text-center py-2 mt-4">
        * Required fields • Choose at least one contact method to receive your secret code
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between mt-8 max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canContinue}
          className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review & Submit <ArrowRight className="w-4 h-4 ml-2 inline" />
        </button>
      </div>
    </div>
  );
}