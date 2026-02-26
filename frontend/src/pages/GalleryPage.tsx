import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import { useGetGalleryImages } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const { data: images, isLoading } = useGetGalleryImages();
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const currentYear = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'innovative-link-expo');

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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Gallery</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <ImageIcon className="w-16 h-16 mb-4 opacity-40" />
            <p className="text-xl font-medium">No images yet</p>
            <p className="text-sm mt-2">Check back soon for gallery updates!</p>
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
                }}
                className={`group relative overflow-hidden rounded-xl border border-border bg-card cursor-pointer transition-all duration-500 ${
                  visibleItems.has(image.id)
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-4'
                }`}
                style={{ transitionDelay: `${(index % 8) * 60}ms` }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.imageBlob.getDirectURL()}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium text-sm truncate">{image.title}</p>
                </div>
                <div className="absolute inset-0 rounded-xl ring-2 ring-primary/0 group-hover:ring-primary/60 transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="bg-card border-t border-border py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear} Innovative Link Expo. All rights reserved.</p>
        <p className="mt-1">
          Built with <span className="text-primary">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
      <FloatingSocialButtons />
    </div>
  );
}
