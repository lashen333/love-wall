// src\app\success\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Camera, Edit, Clock, Heart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get session ID from URL params
    const session = searchParams.get('session_id');
    if (session) {
      setSessionId(session);
      // Store the session ID in localStorage for the upload form
      localStorage.setItem('stripe_session_id', session);
    }
  }, [searchParams]);

  const handleContinueToUpload = async () => {
    if (!sessionId) {
      toast.error('Payment session not found. Please try again.');
      return;
    }

    try {
      setLoading(true);
      
      // Verify the payment session
      const response = await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      
      if (data.success) {
        // Store payment verification in localStorage
        localStorage.setItem('payment_verified', 'true');
        localStorage.setItem('payment_amount', data.data.amount.toString());
        
        // Redirect to the main page with upload form open
        router.push('/?step=upload');
        toast.success('Payment verified! You can now upload your photo.');
      } else {
        toast.error('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Error verifying payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full"
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to the World's Biggest Married Couple Photo Wall
          </p>
        </div>

        {/* What happens next */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">
            What happens next?
          </h2>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Your payment has been processed</span>
              </div>
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">You can now upload your wedding photo</span>
              </div>
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Add your love story details</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Photo will be reviewed within 24 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Once approved, your photo will appear on the heart wall!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Reference */}
        {sessionId && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Reference:</h3>
            <div className="bg-gray-100 rounded-lg p-3">
              <code className="text-sm text-gray-600 break-all">{sessionId}</code>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinueToUpload}
            disabled={loading || !sessionId}
            className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Continue to Photo Upload'}
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </motion.button>
          
          <p className="text-sm text-gray-500 mt-3">
            You'll be redirected to the upload form where you can add your photo
          </p>
        </div>

        {/* Welcome Message */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-pink-600">
            <Heart className="w-5 h-5" />
            <span className="text-lg font-medium">Welcome to the Love Wall family!</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
