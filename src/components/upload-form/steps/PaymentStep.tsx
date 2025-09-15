'use client';

import { CreditCard } from 'lucide-react';

export default function PaymentStep({
  loading,
  onPay,
}: {
  loading: boolean;
  onPay: () => void;
}) {
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
        <div className="text-xs text-gray-500 mt-1">Secure payment via Stripe</div>
      </div>

      <button
        onClick={onPay}
        disabled={loading}
        className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Pay $1 & Continue'}
      </button>
    </div>
  );
}
