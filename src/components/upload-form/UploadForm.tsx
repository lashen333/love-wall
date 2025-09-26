// src\components\upload-form\UploadForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Upload, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import type { UploadFormData } from '@/types';
import { resizeImage, generateThumbnail, validateImageFile } from '@/utils/imageUtils';
import { generateSecretCode } from '@/utils/heartUtils';

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
    email: '', // Add email field best
    weddingDate: '',
    country: '',
    story: '',
    photo: null as any,
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('');
  const [uploadedThumb, setUploadedThumb] = useState<string>('');
  const [secretCode, setSecretCode] = useState('');
  const [loading, setLoading] = useState(false);

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
      const resizedPhoto = await resizeImage(file);
      const thumbnail = await generateThumbnail(file);

      const photoUrl = URL.createObjectURL(resizedPhoto);
      const thumbUrl = URL.createObjectURL(thumbnail);

      setUploadedPhoto(photoUrl);
      setUploadedThumb(thumbUrl);
      setFormData((prev) => ({ ...prev, photo: resizedPhoto }));
      toast.success('Photo uploaded successfully!');
    } catch {
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
    if (!formData.email.trim()) return toast.error('Please enter your email address');
    if (!validateEmail(formData.email)) return toast.error('Please enter a valid email address');
    if (!formData.photo) return toast.error('Please upload a photo');

    try {
      setLoading(true);
      const code = generateSecretCode();
      setSecretCode(code);

      const submitData = new FormData();
      submitData.append('names', formData.names);
      submitData.append('email', formData.email);
      submitData.append('weddingDate', formData.weddingDate || '');
      submitData.append('country', formData.country || '');
      submitData.append('story', formData.story || '');
      submitData.append('photo', formData.photo);
      submitData.append('secretCode', code);

      const response = await fetch('/api/couples', { method: 'POST', body: submitData });
      const data = await response.json();
      
      if (data.success) {
        // Send email with secret code
        await sendSecretCodeEmail(formData.email, code, formData.names);
        
        toast.success('Photo submitted successfully! Check your email for your secret code.');
        onPhotoAdded();
        resetForm();
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

  // Function to send email with secret code
  const sendSecretCodeEmail = async (email: string, secretCode: string, names: string) => {
    try {
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          secretCode,
          names,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Failed to send email:', data.error);
        toast.error('Photo submitted but failed to send email. Please save your code: ' + secretCode);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Photo submitted but failed to send email. Please save your code: ' + secretCode);
    }
  };

  const resetForm = () => {
    setFormData({ 
      names: '', 
      email: '', 
      weddingDate: '', 
      country: '', 
      story: '', 
      photo: null as any 
    });
    setUploadedPhoto('');
    setUploadedThumb('');
    setSecretCode('');
    setCurrentStep('payment');
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
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-4 sm:p-6">
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
    </div>
  );
}