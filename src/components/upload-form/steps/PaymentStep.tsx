// src\components\upload-form\steps\PaymentStep.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export default function PaymentStep({
  loading,
  onPay,
}: {
  loading: boolean;
  onPay: () => void;
}) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <div className="text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full grid place-items-center mx-auto mb-4">
        <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Pay First, Then Upload</h3>
      <p className="text-gray-600 mb-5 max-w-md mx-auto">
        To maintain quality and prevent spam, we require a small $1 fee.
      </p>

      <div className="bg-pink-50 rounded-lg p-4 sm:p-5 mb-6 max-w-md mx-auto">
        <div className="text-2xl font-bold text-pink-600 mb-1">$1.00</div>
        <div className="text-sm text-gray-600">One-time fee per photo</div>
        <div className="text-xs text-gray-500 mt-1">Secure payment via Polar</div>
      </div>

      {/* Terms Acceptance Checkbox (unchanged) */}
      <label className="flex items-start gap-2 text-sm text-gray-700 mb-4 max-w-md mx-auto text-left">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 flex-shrink-0"
          required
        />
        <span>
          I agree to the{' '}
          <Link href="/terms" target="_blank" className="text-pink-600 underline hover:text-pink-700">
            Terms of Service
          </Link>,{' '}
          <Link href="/privacy" target="_blank" className="text-pink-600 underline hover:text-pink-700">
            Privacy Policy
          </Link>, and{' '}
          <Link href="/refund-policy" target="_blank" className="text-pink-600 underline hover:text-pink-700">
            Refund Policy
          </Link>
        </span>
      </label>

      <button
        onClick={onPay}
        disabled={!acceptedTerms || loading}
        className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Pay $1 & Continue'}
      </button>
    </div>
  );
}