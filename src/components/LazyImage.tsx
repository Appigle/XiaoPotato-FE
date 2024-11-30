import { Spinner } from '@material-tailwind/react';
import React, { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  showError?: boolean;
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface ImageDimensions {
  width?: number | string;
  height?: number | string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  showError = false,
  onLoad: externalOnLoad,
  onError: externalOnError,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const dimensions: ImageDimensions = {
    width: width,
    height: height,
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      },
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleLoad = (): void => {
    setIsLoading(false);
    externalOnLoad?.();
  };

  const handleError = (): void => {
    const error = new Error(`Failed to load image: ${src}`);
    setIsLoading(false);
    setError('Failed to load image');
    externalOnError?.(error);
  };

  const containerStyle: React.CSSProperties = {
    minHeight: height || '200px',
    ...dimensions,
  };

  return (
    <div
      ref={imgRef}
      className="relative w-full overflow-hidden rounded-lg bg-gray-100"
      style={containerStyle}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {showError && error && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <span className="text-sm" role="alert" aria-live="polite">
            {error}
          </span>
        </div>
      )}

      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          {...dimensions}
        />
      )}
    </div>
  );
};

export default LazyImage;
