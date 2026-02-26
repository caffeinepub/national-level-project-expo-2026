import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import { useGetGalleryImages } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon } from 'lucide-react';

function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function GalleryCard({ image, index }: { image: { id: string; title: string; imageBlob: { getDirectURL: () => string } }; index: number }) {
  const { ref, visible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-500 cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(24px)',
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image.imageBlob.getDirectURL()}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 2px rgba(15,157,88,0.6), 0 0 30px rgba(15,157,88,0.35)' }}
      />
      {image.title && (
        <div className="px-3 py-2 bg-black/40 backdrop-blur-sm">
          <p className="text-white/80 text-sm font-medium truncate">{image.title}</p>
        </div>
      )}
    </div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden bg-white/5 border border-white/10"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Skeleton className="aspect-square w-full bg-white/10 animate-pulse" />
      <div className="px-3 py-2">
        <Skeleton className="h-4 w-3/4 bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { data: images, isLoading } = useGetGalleryImages();
  const headingAnim = useScrollAnimation(0.1);

  const sortedImages = images
    ? [...images].sort((a, b) => Number(b.uploadedAt) - Number(a.uploadedAt))
    : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Heading */}
        <div
          ref={headingAnim.ref}
          className="text-center mb-14"
          style={{
            opacity: headingAnim.visible ? 1 : 0,
            transform: headingAnim.visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Gallery
          </h1>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#0f9d58] to-[#22c55e]" />
          <p className="mt-4 text-white/50 text-base sm:text-lg max-w-xl mx-auto">
            Moments captured from InnovativeLink Expo
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && sortedImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-white/60 text-lg">No photos yet — check back soon!</p>
          </div>
        )}

        {/* Image grid */}
        {!isLoading && sortedImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sortedImages.map((image, index) => (
              <GalleryCard key={image.id} image={image} index={index} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <FloatingSocialButtons />
    </div>
  );
}
