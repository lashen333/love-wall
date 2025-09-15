// src\components\upload-form\steps\DetailsStep.tsx
'use client';

import { ArrowLeft, ArrowRight, User } from 'lucide-react';
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
  const canContinue = !!formData.names.trim();

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Names *</label>
          <input
            type="text"
            value={formData.names}
            onChange={(e) => setFormData((prev) => ({ ...prev, names: e.target.value }))}
            placeholder="e.g., Sarah & Michael"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
          <input
            type="date"
            value={formData.weddingDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, weddingDate: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

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

      <div className="flex flex-col sm:flex-row gap-3 justify-between mt-8 max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review & Submit <ArrowRight className="w-4 h-4 ml-2 inline" />
        </button>
      </div>
    </div>
  );
}
