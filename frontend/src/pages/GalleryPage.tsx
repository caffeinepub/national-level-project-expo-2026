import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import ScrollProgressBar from '../components/ScrollProgressBar';
import { useGetGalleryImages } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const { data: images, isLoading } = useGetGalleryImages();
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setVisibleItems((prev) => new Set([...prev, id]));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [images]);

  return (
    <div className="min-h-screen" style={{ background: '#050f0a' }}>
      <ScrollProgressBar />
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              background: 'rgba(15,157,88,0.1)',
              border: '1px solid rgba(15,157,88,0.3)',
              color: '#22c55e',
            }}
          >
            <ImageIcon className="w-3 h-3" />
            Photo Gallery
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #0f9d58)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Gallery
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Explore moments captured from Innovative Link Expo events
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading && (!images || images.length === 0) && (
          <div className="flex flex-col items-center justify-center py-24" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <ImageIcon className="w-16 h-16 mb-4 opacity-40" />
            <p className="text-xl font-medium text-white/50">No images yet</p>
            <p className="text-sm mt-2 text-white/30">Check back soon for gallery updates!</p>
          </div>
        )}

        {!isLoading && images && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={image.id}
                data-id={image.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(image.id, el);
                  else itemRefs.current.delete(image.id);
                }}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                style={{
                  border: '1px solid rgba(15,157,88,0.15)',
                  opacity: visibleItems.has(image.id) ? 1 : 0,
                  transform: visibleItems.has(image.id) ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
                  transition: `opacity 0.5s ease ${index * 60}ms, transform 0.5s ease ${index * 60}ms`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                <img
                  src={image.imageBlob.getDirectURL()}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}
                >
                  <p className="text-white font-semibold text-sm truncate w-full">{image.title}</p>
                </div>
                {/* Green glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 30px rgba(15,157,88,0.2)' }}
                />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <FloatingSocialButtons />
    </div>
  );
}
