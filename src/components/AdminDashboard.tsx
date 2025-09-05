// src\components\AdminDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, Trash2, Shield } from 'lucide-react';
import { Couple } from '@/types';
import toast from 'react-hot-toast';

interface AdminDashboardProps {
  password: string;
}

export function AdminDashboard({ password }: AdminDashboardProps) {
  const [couples, setCouples] = useState<Couple[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCouple, setSelectedCouple] = useState<Couple | null>(null);

  useEffect(() => {
    fetchCouples();
  }, []);

  const fetchCouples = async () => {
    try {
      const response = await fetch('/api/couples?status=pending&limit=100');
      const data = await response.json();
      if (data.success) {
        setCouples(data.data);
      }
    } catch (error) {
      console.error('Error fetching couples:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (coupleId: string) => {
    try {
      const response = await fetch(`/api/admin/approve/${coupleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Photo approved!');
        fetchCouples(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to approve');
      }
    } catch (error) {
      toast.error('Error approving photo');
    }
  };

  const handleReject = async (coupleId: string) => {
    try {
      const response = await fetch(`/api/admin/reject/${coupleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Photo rejected');
        fetchCouples(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to reject');
      }
    } catch (error) {
      toast.error('Error rejecting photo');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-pink-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Review and manage couple submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-pink-600 mb-2">
            {couples.filter(c => c.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {couples.filter(c => c.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {couples.filter(c => c.status === 'rejected').length}
          </div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {couples.length}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>

      {/* Pending Submissions */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Pending Submissions
          </h2>
        </div>

        {couples.filter(c => c.status === 'pending').length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No pending submissions to review
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {couples
              .filter(c => c.status === 'pending')
              .map((couple) => (
                <div key={couple._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    {/* Photo Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={couple.thumbUrl}
                        alt={couple.names}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {couple.names}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        {couple.weddingDate && (
                          <div>
                            <span className="font-medium">Wedding Date:</span>
                            <span className="ml-2">
                              {new Date(couple.weddingDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        {couple.country && (
                          <div>
                            <span className="font-medium">Country:</span>
                            <span className="ml-2">{couple.country}</span>
                          </div>
                        )}
                        
                        {couple.story && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Story:</span>
                            <p className="mt-1 text-gray-700">{couple.story}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        Submitted: {new Date(couple.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedCouple(couple)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Full
                      </button>
                      
                      <button
                        onClick={() => handleApprove(couple._id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      
                      <button
                        onClick={() => handleReject(couple._id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedCouple && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCouple(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCouple.names}
                </h2>
                <button
                  onClick={() => setSelectedCouple(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <img
                src={selectedCouple.photoUrl}
                alt={selectedCouple.names}
                className="w-full h-auto rounded-lg mb-4"
              />

              <div className="space-y-3">
                {selectedCouple.weddingDate && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Wedding Date:</span>
                    <span className="text-gray-800">
                      {new Date(selectedCouple.weddingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {selectedCouple.country && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Country:</span>
                    <span className="text-gray-800">{selectedCouple.country}</span>
                  </div>
                )}

                {selectedCouple.story && (
                  <div>
                    <span className="font-medium text-gray-600">Story:</span>
                    <p className="text-gray-800 mt-1">{selectedCouple.story}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleApprove(selectedCouple._id);
                    setSelectedCouple(null);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                
                <button
                  onClick={() => {
                    handleReject(selectedCouple._id);
                    setSelectedCouple(null);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

