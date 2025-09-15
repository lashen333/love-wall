// src\components\upload-form\steps\UploadStep.tsx
'use client';

import { useDropzone } from 'react-dropzone';
import { Upload, ArrowRight } from 'lucide-react';

export default function UploadStep({
  uploadedPhoto,
  onPhotoDrop,
  onNext,
}: {
  uploadedPhoto: string;
  onPhotoDrop: (files: File[]) => void | Promise<void>;
  onNext: () => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: onPhotoDrop,
  });

  return (
    <div className="text-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full grid place-items-center mx-auto mb-5 sm:mb-6">
        <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-pink-600" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Upload Your Wedding Photo</h3>
      <p className="text-gray-600 mb-6 sm:mb-8">Choose a beautiful photo that represents your love story</p>

      <div
        {...getRootProps()}
        className={`${isDragActive ? 'upload-zone-active' : ''} upload-zone mb-6 w-full min-h-44 sm:min-h-56`}
      >
        <input {...getInputProps()} />
        {uploadedPhoto ? (
          <div>
            <img
              src={uploadedPhoto}
              alt="Preview"
              className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-lg mx-auto mb-4"
            />
            <p className="text-green-600 font-semibold">Photo uploaded successfully!</p>
            <p className="text-sm text-gray-500">Click to change photo</p>
          </div>
        ) : (
          <div>
            <Upload className="w-14 h-14 sm:w-16 sm:h-16 text-pink-400 mx-auto mb-4" />
            <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
              {isDragActive ? 'Drop your photo here' : 'Drag & drop your photo here'}
            </p>
            <p className="text-gray-500 mb-2">or click to browse</p>
            <p className="text-xs text-gray-400">JPEG, PNG, WebP up to 10MB</p>
          </div>
        )}
      </div>

      {uploadedPhoto && (
        <div className="text-center">
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue to Details <ArrowRight className="w-4 h-4 ml-2 inline" />
          </button>
        </div>
      )}
    </div>
  );
}
