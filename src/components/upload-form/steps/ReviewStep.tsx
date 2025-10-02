// src\components\upload-form\steps\ReviewStep.tsx
'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle, Copy } from 'lucide-react';
import type { UploadFormData } from '@/types';
import { copyToClipboard, showCopyFeedback } from '@/utils/clipboard';

export default function ReviewStep({
  uploadedPhoto,
  formData,
  secretCode,
  loading,
  onBack,
  onSubmit,
}: {
  uploadedPhoto: string;
  formData: UploadFormData;
  secretCode: string;
  loading: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const handleCopySecretCode = async () => {
    if (!secretCode) return;
    
    const success = await copyToClipboard(secretCode);
    if (copyButtonRef.current) {
      showCopyFeedback(copyButtonRef.current, success);
    }
  };
  return (
    <div className="text-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full grid place-items-center mx-auto mb-5 sm:mb-6">
        <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-pink-600" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 sm:mb-6">Review Your Submission</h3>

      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <img src={uploadedPhoto} alt="Preview" className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3" />
          <p className="text-sm text-gray-600">Your wedding photo</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <h4 className="font-semibold text-gray-800 mb-3">Details</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Names:</span>
              <span className="ml-2 text-gray-800">{formData.names}</span>
            </div>
            {formData.weddingDate && (
              <div>
                <span className="font-medium text-gray-600">Wedding Date:</span>
                <span className="ml-2 text-gray-800">
                  {new Date(formData.weddingDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {formData.country && (
              <div>
                <span className="font-medium text-gray-600">Country:</span>
                <span className="ml-2 text-gray-800">{formData.country}</span>
              </div>
            )}
            {formData.story && (
              <div >
                <span className="font-medium text-gray-600">Story:</span>
                <p className="prose-wrap ml-2 text-gray-800 mt-1">{formData.story}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
          <h4 className="font-semibold text-pink-800 mb-2">Important!</h4>
          <p className="text-sm text-pink-700 mb-3">Save this secret code to remove your photo later if needed:</p>
          <div className="bg-white rounded-lg p-3 border border-pink-300">
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono text-pink-600 font-bold flex-1">
                {secretCode || 'Will be generated after submission'}
              </code>
              {secretCode && (
                <button
                  ref={copyButtonRef}
                  onClick={handleCopySecretCode}
                  className="ml-3 flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors duration-200 text-sm font-medium border border-pink-200"
                  title="Click to copy secret code"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              )}
            </div>
          </div>
          {secretCode && (
            <p className="text-xs text-pink-600 mt-2 text-center">
              💡 Click the "Copy" button to copy your secret code to clipboard
            </p>
          )}
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
          onClick={onSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit to Love Wall'}
        </button>
      </div>
    </div>
  );
}
