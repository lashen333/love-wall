'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Heart, Upload, CreditCard, User, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { UploadFormData } from '@/types';
import { resizeImage, generateThumbnail, validateImageFile, formatFileSize } from '@/utils/imageUtils';
import { generateSecretCode } from '@/utils/heartUtils';
import toast from 'react-hot-toast';

interface UploadFormProps {
  onPhotoAdded: () => void;
  totalCount: number;
}

type Step = 'payment' | 'upload' | 'details' | 'review';

export function UploadForm({ onPhotoAdded, totalCount }: UploadFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>('payment');
  const [formData, setFormData] = useState<UploadFormData>({
    names: '',
    weddingDate: '',
    country: '',
    story: '',
    photo: null as any,
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('');
  const [uploadedThumb, setUploadedThumb] = useState<string>('');
  const [secretCode, setSecretCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSession, setPaymentSession] = useState<any>(null);

  // Check if payment is already verified
  useEffect(() => {
    const paymentVerified = localStorage.getItem('payment_verified');
    if (paymentVerified === 'true') {
      setCurrentStep('upload');
    }
  }, []);

  const steps = [
    { id: 'payment', title: 'Pay First', icon: CreditCard },
    { id: 'upload', title: 'Upload Photo', icon: Upload },
    { id: 'details', title: 'Add Details', icon: User },
    { id: 'review', title: 'Review & Submit', icon: CheckCircle },
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: handlePhotoDrop
  });

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
      
      // Resize and generate thumbnail
      const resizedPhoto = await resizeImage(file);
      const thumbnail = await generateThumbnail(file);
      
      // Convert to data URLs for preview
      const photoUrl = URL.createObjectURL(resizedPhoto);
      const thumbUrl = URL.createObjectURL(thumbnail);
      
      setUploadedPhoto(photoUrl);
      setUploadedThumb(thumbUrl);
      setFormData(prev => ({ ...prev, photo: resizedPhoto }));
      
      toast.success('Photo uploaded successfully!');
    } catch (error) {
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
        body: JSON.stringify({ amount: 200 }) // $2.00 in cents
      });
      
      const data = await response.json();
      if (data.success) {
        setPaymentSession(data.data);
        window.location.href = data.data.url; // Redirect to Stripe
      } else {
        toast.error(data.error || 'Payment failed');
      }
    } catch (error) {
      toast.error('Error creating payment session');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.names.trim()) {
      toast.error('Please enter your names');
      return;
    }

    if (!formData.photo) {
      toast.error('Please upload a photo');
      return;
    }

    try {
      setLoading(true);
      
      // Generate secret code
      const code = generateSecretCode();
      setSecretCode(code);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('names', formData.names);
      submitData.append('weddingDate', formData.weddingDate || '');
      submitData.append('country', formData.country || '');
      submitData.append('story', formData.story || '');
      submitData.append('photo', formData.photo);
      submitData.append('secretCode', code);

      const response = await fetch('/api/couples', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Photo submitted successfully! It will be reviewed within 24 hours.');
        onPhotoAdded();
        resetForm();
      } else {
        toast.error(data.error || 'Submission failed');
      }
    } catch (error) {
      toast.error('Error submitting photo');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      names: '',
      weddingDate: '',
      country: '',
      story: '',
      photo: null as any,
    });
    setUploadedPhoto('');
    setUploadedThumb('');
    setSecretCode('');
    setCurrentStep('payment');
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as Step);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as Step);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-4">
          Join the Love Wall
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Season 1: Limited Time - $2 per photo
        </p>
        
        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-pink-500 to-rose-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${((steps.findIndex(s => s.id === currentStep) + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center ${isActive ? 'text-pink-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  isActive ? 'border-pink-600 bg-pink-50' : 
                  isCompleted ? 'border-green-600 bg-green-50' : 
                  'border-gray-300 bg-gray-50'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <span className="text-xs mt-2 font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {/* Payment Step */}
          {currentStep === 'payment' && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-12 h-12 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Pay First, Then Upload
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                To maintain quality and prevent spam, we require a small $2 fee. 
                This helps us keep the wall beautiful for everyone.
              </p>
              
              <div className="bg-pink-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
                <div className="text-3xl font-bold text-pink-600 mb-2">$2.00</div>
                <div className="text-sm text-gray-600">One-time fee per photo</div>
                <div className="text-xs text-gray-500 mt-2">
                  Secure payment via Stripe
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Pay $2 & Continue'}
              </button>
            </div>
          )}

          {/* Upload Step */}
          {currentStep === 'upload' && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-12 h-12 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Upload Your Wedding Photo
              </h3>
              <p className="text-gray-600 mb-8">
                Choose a beautiful photo that represents your love story
              </p>

              <div
                {...getRootProps()}
                className={`upload-zone ${isDragActive ? 'upload-zone-active' : ''} mb-6`}
              >
                <input {...getInputProps()} />
                {uploadedPhoto ? (
                  <div>
                    <img 
                      src={uploadedPhoto} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                    />
                    <p className="text-green-600 font-semibold">Photo uploaded successfully!</p>
                    <p className="text-sm text-gray-500">Click to change photo</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {isDragActive ? 'Drop your photo here' : 'Drag & drop your photo here'}
                    </p>
                    <p className="text-gray-500 mb-2">or click to browse</p>
                    <p className="text-xs text-gray-400">
                      JPEG, PNG, WebP up to 10MB
                    </p>
                  </div>
                )}
              </div>

              {uploadedPhoto && (
                <div className="text-center">
                  <button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Continue to Details <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Details Step */}
          {currentStep === 'details' && (
            <div>
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-12 h-12 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Tell Us About Your Love Story
                </h3>
                <p className="text-gray-600">
                  Add some details to make your photo special
                </p>
              </div>

              <div className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Names *
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
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, weddingDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="e.g., United States"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Story (Optional)
                  </label>
                  <textarea
                    value={formData.story}
                    onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                    placeholder="Share a brief story about your love journey..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.story.length}/500 characters
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8 max-w-md mx-auto">
                <button
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.names.trim()}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Submit <ArrowRight className="w-4 h-4 ml-2 inline" />
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Review Your Submission
              </h3>

              <div className="max-w-md mx-auto space-y-6">
                {/* Photo Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <img 
                    src={uploadedPhoto} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <p className="text-sm text-gray-600">Your wedding photo</p>
                </div>

                {/* Details Review */}
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
                      <div>
                        <span className="font-medium text-gray-600">Story:</span>
                        <p className="ml-2 text-gray-800 mt-1">{formData.story}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Secret Code Info */}
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                  <h4 className="font-semibold text-pink-800 mb-2">Important!</h4>
                  <p className="text-sm text-pink-700 mb-3">
                    Save this secret code to remove your photo later if needed:
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-pink-300">
                    <code className="text-lg font-mono text-pink-600 font-bold">
                      {secretCode || 'Will be generated after submission'}
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8 max-w-md mx-auto">
                <button
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit to Love Wall'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

