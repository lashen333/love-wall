// src\components\PhotoRemoval.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Shield, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export function PhotoRemoval() {
  const [formData, setFormData] = useState({
    names: '',
    secretCode: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.names.trim() || !formData.secretCode.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/couples/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Photo removed successfully');
        setFormData({ names: '', secretCode: '', reason: '' });
      } else {
        toast.error(data.error || 'Failed to remove photo');
      }
    } catch (error) {
      toast.error('Error removing photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Need to Remove Your Photo?
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          We understand that circumstances change. Use your secret code to remove your photo from the wall.
        </p>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Important Notice</h3>
            <p className="text-sm text-amber-700">
              Photo removal is permanent and cannot be undone. Make sure you have your 8-digit secret code ready.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Names (as submitted) *
          </label>
          <input
            type="text"
            value={formData.names}
            onChange={(e) => setFormData(prev => ({ ...prev, names: e.target.value }))}
            placeholder="e.g., Sarah & Michael"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            8-Digit Secret Code *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.secretCode}
              onChange={(e) => setFormData(prev => ({ ...prev, secretCode: e.target.value }))}
              placeholder="12345678"
              maxLength={8}
              pattern="[0-9]{8}"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-lg tracking-wider"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This is the 8-digit code you received when you submitted your photo
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Removal (Optional)
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="Tell us why you're removing your photo..."
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.reason.length}/200 characters
          </p>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Removing Photo...' : 'Remove Photo'}
        </motion.button>
      </form>

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Need Help?</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Make sure you're using the exact names you submitted</p>
          <p>• Your secret code is 8 digits long (numbers only)</p>
          <p>• Check your email for the secret code if you can't find it</p>
          <p>• Contact support if you continue having issues</p>
        </div>
      </div>
    </div>
  );
}

