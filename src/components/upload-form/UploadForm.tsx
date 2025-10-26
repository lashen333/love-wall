// src\components\upload-form\UploadForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Upload, User, CheckCircle, Copy, X } from 'lucide-react';
import toast from 'react-hot-toast';

import type { UploadFormData } from '@/types';
import { resizeImage, generateThumbnail, validateImageFile, optimizeImage } from '@/utils/imageUtils';
import { generateSecretCode } from '@/utils/heartUtils';
import { copyToClipboard, showCopyFeedback } from '@/utils/clipboard';

import StepIndicator from './StepIndicator';
import PaymentStep from './steps/PaymentStep';
import UploadStep from './steps/UploadStep';
import DetailsStep from './steps/DetailsStep';
import ReviewStep from './steps/ReviewStep';
import type { Step } from './types';

interface UploadFormProps {
  onPhotoAdded: () => void;
  totalCount: number;
}

export default function UploadForm({ onPhotoAdded }: UploadFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>('payment');
  const [formData, setFormData] = useState<UploadFormData>({
    names: '',
    email: '',
    phoneNumber: '',
    weddingDate: '',
    country: '',
    story: '',
    photo: null as any,
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('');
  const [uploadedThumb, setUploadedThumb] = useState<string>('');
  const [secretCode, setSecretCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const paymentVerified = localStorage.getItem('payment_verified');
    if (paymentVerified === 'true') setCurrentStep('upload');
  }, []);

  const steps = [
    { id: 'payment', title: 'Pay First', icon: CreditCard },
    { id: 'upload', title: 'Upload Photo', icon: Upload },
    { id: 'details', title: 'Add Details', icon: User },
    { id: 'review', title: 'Review & Submit', icon: CheckCircle },
  ] as const;

  const stepIndex = steps.findIndex((s) => s.id === currentStep);
  const progressPct = ((stepIndex + 1) / steps.length) * 100;

  async function handlePhotoDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    try {
      setLoading(true);
      
      // Use optimized image processing
      const [resizedPhoto, thumbnail] = await Promise.all([
        optimizeImage(file, 1920, 0.85), // Optimized main image
        generateThumbnail(file, 400) // Thumbnail
      ]);

      const photoUrl = URL.createObjectURL(resizedPhoto);
      const thumbUrl = URL.createObjectURL(thumbnail);

      setUploadedPhoto(photoUrl);
      setUploadedThumb(thumbUrl);
      setFormData((prev) => ({ ...prev, photo: resizedPhoto }));
      toast.success('Photo uploaded and optimized successfully!');
    } catch (error) {
      console.error('Image processing error:', error);
      toast.error('Error processing photo. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = data.data.url;
      } else {
        toast.error(data.error || 'Payment failed');
      }
    } catch {
      toast.error('Error creating payment session');
    } finally {
      setLoading(false);
    }
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.names.trim()) return toast.error('Please enter your names');
    if (!formData.email.trim() && !formData.phoneNumber.trim()) {
      return toast.error('Please provide at least one contact method (email or phone)');
    }
    if (formData.email && !validateEmail(formData.email)) return toast.error('Please enter a valid email address');
    if (!formData.photo) return toast.error('Please upload a photo');

    try {
      setLoading(true);
      const code = generateSecretCode();
      setSecretCode(code);

      const submitData = new FormData();
      submitData.append('names', formData.names);
      submitData.append('email', formData.email || '');
      submitData.append('phoneNumber', formData.phoneNumber || '');
      submitData.append('weddingDate', formData.weddingDate || '');
      submitData.append('country', formData.country || '');
      submitData.append('story', formData.story || '');
      submitData.append('photo', formData.photo);
      submitData.append('secretCode', code);

      const response = await fetch('/api/couples', { method: 'POST', body: submitData });
      const data = await response.json();
      
      if (data.success) {
        // Show success modal with secret code
        toast.success('Photo submitted successfully! Save your secret code below.');
        setShowSuccessModal(true);
        onPhotoAdded();
      } else {
        toast.error(data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting photo:', error);
      toast.error('Error submitting photo');
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setFormData({ 
      names: '', 
      email: '',
      phoneNumber: '',
      weddingDate: '', 
      country: '', 
      story: '', 
      photo: null as any 
    });
    setUploadedPhoto('');
    setUploadedThumb('');
    setSecretCode('');
    setCurrentStep('payment');
    setShowSuccessModal(false);
  };

  const handleCopySecretCode = async () => {
    if (!secretCode) return;
    
    const success = await copyToClipboard(secretCode);
    if (success) {
      toast.success('Secret code copied to clipboard!');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const nextStep = () => {
    const idx = steps.findIndex((s) => s.id === currentStep);
    if (idx < steps.length - 1) setCurrentStep(steps[idx + 1].id);
  };
  
  const prevStep = () => {
    const idx = steps.findIndex((s) => s.id === currentStep);
    if (idx > 0) setCurrentStep(steps[idx - 1].id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-4 sm:p-6" id="add">
      {/* ===== TOP HEADER (always visible) ===== */}
      <div className="text-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Join the Love Wall</h2>
        <p className="text-sm sm:text-base text-gray-600">Season 1: Limited Time - $1 per photo</p>

        {/* progress */}
        <div className="bg-gray-200 rounded-full h-2 sm:h-2.5 mt-4 mb-1">
          <div
            className="bg-gradient-to-r from-pink-500 to-rose-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-600">Step {stepIndex + 1} of {steps.length}</p>
      </div>

      {/* step indicator under header */}
      <StepIndicator steps={steps} currentStep={currentStep as Step} />

      {/* ===== STEP CONTENT ===== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[240px] sm:min-h-[300px]"
        >
          {currentStep === 'payment' && (
            <PaymentStep loading={loading} onPay={handlePayment} />
          )}

          {currentStep === 'upload' && (
            <UploadStep uploadedPhoto={uploadedPhoto} onPhotoDrop={handlePhotoDrop} onNext={nextStep} />
          )}

          {currentStep === 'details' && (
            <DetailsStep formData={formData} setFormData={setFormData} onNext={nextStep} onBack={prevStep} />
          )}

          {currentStep === 'review' && (
            <ReviewStep
              uploadedPhoto={uploadedPhoto}
              formData={formData}
              secretCode={secretCode}
              loading={loading}
              onBack={prevStep}
              onSubmit={handleSubmit}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Success Modal with Secret Code */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Success! 🎉</h2>
              <p className="text-gray-600 mb-6">Your photo has been submitted to the Love Wall!</p>
              
              {/* Secret Code Section */}
              <div className="bg-pink-50 rounded-lg p-4 border border-pink-200 mb-6">
                <h3 className="font-semibold text-pink-800 mb-2">Your Secret Code</h3>
                <p className="text-sm text-pink-700 mb-3">Save this code to remove your photo later if needed:</p>
                
                <div className="bg-white rounded-lg p-3 border border-pink-300">
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-mono text-pink-600 font-bold flex-1">
                      {secretCode}
                    </code>
                    <button
                      onClick={handleCopySecretCode}
                      className="ml-3 flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors duration-200 text-sm font-medium border border-pink-200"
                      title="Click to copy secret code"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-pink-600 mt-2">
                  💡 Click "Copy" to save your secret code to clipboard
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="bg-blue-50 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800">
                  📧 Your contact information has been saved. 
                  Make sure to save your secret code above for future reference!
                </p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={resetForm}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}