// src\app\HomePageClient.tsx

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import  HeartWall  from '@/components/heart-wall/HeartWall';
import PhotoAlbum from '@/components/photo-album';
import { UploadForm } from '@/components/upload-form';
import { PhotoRemoval } from '@/components/PhotoRemoval';
import type { Couple } from '@/types';


export default function HomePageClient({
  initialCouples,
  searchParams,
}: {
  initialCouples: Couple[];
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [couples, setCouples] = useState<Couple[]>(initialCouples);
  const [loading, setLoading] = useState<boolean>(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const totalCount = useMemo(() => couples.length, [couples]);

  // Optimized periodic refresh with caching
  useEffect(() => {
    let mounted = true;

    const fetchCouples = async () => {
      try {
        // Check if we have recent cached data
        const cacheKey = 'homepage-couples';
        const cached = sessionStorage.getItem(cacheKey);
        const cacheTime = sessionStorage.getItem(`${cacheKey}-time`);
        const now = Date.now();
        const maxAge = 2 * 60 * 1000; // 2 minutes
        
        if (cached && cacheTime && (now - parseInt(cacheTime)) < maxAge) {
          const data = JSON.parse(cached);
          if (mounted) {
            setCouples(data);
          }
          return;
        }

        const res = await fetch('/api/couples?status=approved&limit=100', {
          cache: 'force-cache', // Use browser cache
        });
        const json = await res.json();
        if (mounted && json?.success) {
          const data = json.data ?? [];
          setCouples(data);
          
          // Cache the results
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
          sessionStorage.setItem(`${cacheKey}-time`, now.toString());
        }
      } catch (err) {
        // ignore
      }
    };

    // Initial fetch
    fetchCouples();
    
    // Reduced frequency to 60 seconds
    const id = setInterval(fetchCouples, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // Handle step=upload + localStorage flag
  useEffect(() => {
    const raw = searchParams?.step;
    const step = Array.isArray(raw) ? raw[0] : raw;
    const paymentVerified = typeof window !== 'undefined'
      ? localStorage.getItem('payment_verified')
      : null;

    if (step === 'upload' && paymentVerified === 'true') {
      setShowUploadForm(true);
      setTimeout(() => {
        document.getElementById('upload-form')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 500);
    }
  }, [searchParams]);

  const handlePhotoAdded = () => {
    // Clear cache and refresh data after add
    (async () => {
      try {
        // Clear cached data to force fresh fetch
        sessionStorage.removeItem('homepage-couples');
        sessionStorage.removeItem('homepage-couples-time');
        
        const res = await fetch('/api/couples?status=approved&limit=100', {
          cache: 'no-store',
        });
        const json = await res.json();
        if (json?.success) {
          const data = json.data ?? [];
          setCouples(data);
          
          // Update cache with fresh data
          sessionStorage.setItem('homepage-couples', JSON.stringify(data));
          sessionStorage.setItem('homepage-couples-time', Date.now().toString());
        }
      } catch {}
    })();

    setShowUploadForm(false);
    localStorage.removeItem('payment_verified');
    localStorage.removeItem('stripe_session_id');
    localStorage.removeItem('payment_amount');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text text-shadow"
          >
            World&apos;s Biggest Married Couple Photo Wall
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto"
          >
            Join {totalCount.toLocaleString()}+ couples celebrating love around the world
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <div className="bg-white rounded-full h-4 max-w-2xl mx-auto shadow-lg overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-600 h-full transition-all duration-1000 ease-out"
                style={{ width: `${(totalCount / 1000000) * 100}%` }}
              />
            </div>
            <p className="text-lg text-gray-600 mt-3">
              {totalCount.toLocaleString()} / 1,000,000 spots taken
            </p>
          </motion.div>
        </div>
      </section>

      {/* Heart Wall Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <HeartWall couples={couples} loading={loading} />
          </motion.div>
        </div>
      </section>

      {/* Photo Album Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            Photo Album
          </motion.h2>

          {/* Pass couples so PhotoAlbum does NOT self-fetch */}
          <PhotoAlbum interval={2000}/>
        </div>
      </section>

      {/* Upload Form Section */}
      <section id="upload-form" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <UploadForm onPhotoAdded={handlePhotoAdded} totalCount={totalCount} />
          </motion.div>
        </div>
      </section>

      {/* Photo Removal Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <PhotoRemoval />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
<footer className="py-12 px-4 text-center text-gray-600">
  <div className="max-w-4xl mx-auto">
    <p className="text-lg mb-4">Made with ❤️ for couples around the world</p>
    
    {/* Legal Links */}
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm mb-4">
      <Link href="/terms" className="text-pink-600 hover:text-pink-700 underline">
        Terms of Service
      </Link>
      <span className="text-gray-400">|</span>
      <Link href="/privacy" className="text-pink-600 hover:text-pink-700 underline">
        Privacy Policy
      </Link>
      <span className="text-gray-400">|</span>
      <Link href="/refund-policy" className="text-pink-600 hover:text-pink-700 underline">
        Refund Policy
      </Link>
    </div>
    
    <p className="text-sm">© 2025 World&apos;s Biggest Married Couple Photo Wall. All rights reserved.</p>
  </div>
</footer>
    </div>
  );
}
