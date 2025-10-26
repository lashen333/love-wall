// src\components\photo-album\CtaSlide.tsx
'use client';

import { Shield, Eye, Sparkles } from 'lucide-react';

export default function CtaSlide() {
  const handleScrollToForm = () => {
    const formElement = document.getElementById('add');
    if (formElement) {
      formElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  return (
    <div className="relative h-full">
      <div className="absolute inset-4 grid place-items-center rounded-xl bg-gradient-to-br from-white/85 to-white/60 shadow">
        <div className="text-center px-6">
          <div className="text-2xl sm:text-4xl font-extrabold text-rose-700">
            Add your love
          </div>
          <p className="mt-2 text-rose-900/80 text-sm max-w-md mx-auto">
            Become part of the world's biggest love album. Your photo inspires the next couple ♥
          </p>
          
          <button
            onClick={handleScrollToForm}
            className="inline-block mt-4 px-6 py-2 rounded-full bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Upload your photo
          </button>
          
          {/* Trust Badges */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-green-600" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Reviewed</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}