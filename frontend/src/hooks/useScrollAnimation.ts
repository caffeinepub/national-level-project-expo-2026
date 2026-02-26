import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  variant?: 'fade-in' | 'slide-up';
  delay?: number;
  threshold?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { variant = 'fade-in', delay = 0, threshold = 0.15 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenClass = variant === 'slide-up' ? 'animate-slide-up-hidden' : 'animate-fade-in-hidden';
  const visibleClass = variant === 'slide-up' ? 'animate-slide-up' : 'animate-fade-in';
  const animationClass = isVisible ? visibleClass : hiddenClass;

  const style = delay > 0 ? { animationDelay: `${delay}ms` } : {};

  return { ref, isVisible, animationClass, style };
}
