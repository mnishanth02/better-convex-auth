/**
 * Optimized Image Components
 *
 * Next.js Image component wrapper with enhanced features for better performance.
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@workspace/ui/lib/utils";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@/components/ui/loading-states";
import { ImageIcon, Download, ZoomIn, ZoomOut, RotateCw, Eye } from "lucide-react";
import { generateUniqueId } from "@/lib/utils";

// Base optimized image component
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  onClick?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
  fallback?: React.ReactNode;
  showLoadingIndicator?: boolean;
  containerClassName?: string;
  style?: React.CSSProperties;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  sizes,
  priority = false,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
  fallback,
  showLoadingIndicator = true,
  containerClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate blur data URL for placeholder
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const containerProps = fill
    ? { className: cn("relative", containerClassName) }
    : { ref: imgRef, className: cn("relative", containerClassName) };

  if (hasError) {
    return (
      <div {...containerProps}>
        {fallback || (
          <div
            className={cn(
              "flex items-center justify-center bg-muted",
              fill ? "absolute inset-0" : `w-[${width}px] h-[${height}px]`,
              className,
            )}
          >
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    ...(fill ? { fill: true } : { width, height }),
    className: cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", className),
    sizes: sizes || (fill ? "100vw" : undefined),
    priority,
    quality,
    placeholder: placeholder as any,
    blurDataURL: blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined),
    onLoad: handleLoad,
    onError: handleError,
    onClick: props.onClick,
    ...props,
  };

  return (
    <div {...containerProps}>
      {(isIntersecting || priority) && <Image {...imageProps} />}

      {/* Loading indicator */}
      {isLoading && showLoadingIndicator && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-muted",
            fill ? "" : `w-[${width}px] h-[${height}px]`,
          )}
        >
          <Skeleton className={cn("w-full h-full", !fill && width && height && `w-[${width}px] h-[${height}px]`)} />
        </div>
      )}
    </div>
  );
}

// Avatar component with optimized images
export interface OptimizedAvatarProps {
  src?: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  fallback?: React.ReactNode;
  initials?: string;
}

export function OptimizedAvatar({
  src,
  alt,
  size = "md",
  className,
  fallback,
  initials,
  ...props
}: OptimizedAvatarProps) {
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    "2xl": 80,
  };

  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-20 w-20",
  };

  const dimension = sizeMap[size];

  const defaultFallback = (
    <div
      className={cn(
        "flex items-center justify-center bg-muted rounded-full text-muted-foreground font-medium",
        sizeClasses[size],
        className,
      )}
    >
      {initials || alt.slice(0, 2).toUpperCase()}
    </div>
  );

  if (!src) {
    return fallback || defaultFallback;
  }

  return (
    <div className={cn("rounded-full overflow-hidden", sizeClasses[size], className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={dimension}
        height={dimension}
        className="object-cover"
        fallback={fallback || defaultFallback}
        quality={80}
        {...props}
      />
    </div>
  );
}

// Image gallery with lazy loading
export interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  }>;
  columns?: number;
  gap?: number;
  className?: string;
  onImageClick?: (index: number) => void;
}

export function ImageGallery({ images, columns = 3, gap = 4, className, onImageClick }: ImageGalleryProps) {
  return (
    <div
      className={cn("grid gap-4", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap * 0.25}rem`,
      }}
    >
      {images.map((image, index) => (
        <Card key={generateUniqueId()} className="overflow-hidden group cursor-pointer">
          <div className="aspect-square relative">
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onClick={() => onImageClick?.(index)}
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>

          {image.caption && (
            <div className="p-3">
              <p className="text-sm text-muted-foreground">{image.caption}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// Hero image with progressive loading
export interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  overlayContent?: React.ReactNode;
  height?: string;
}

export function HeroImage({ src, alt, className, overlay = false, overlayContent, height = "h-96" }: HeroImageProps) {
  return (
    <div className={cn("relative overflow-hidden", height, className)}>
      <OptimizedImage src={src} alt={alt} fill priority className="object-cover" sizes="100vw" quality={85} />

      {overlay && <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />}

      {overlayContent && <div className="absolute inset-0 flex items-end justify-start p-8">{overlayContent}</div>}
    </div>
  );
}

// Image with zoom functionality
export function ZoomableImage({ src, alt, width, height, className, ...props }: OptimizedImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);

  const toggleZoom = () => setIsZoomed(!isZoomed);
  const rotate = () => setRotation((prev) => (prev + 90) % 360);
  const resetTransform = () => {
    setIsZoomed(false);
    setRotation(0);
  };

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-lg">
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "transition-transform duration-300 cursor-zoom-in",
            isZoomed && "scale-150 cursor-zoom-out",
            className,
          )}
          style={{
            transform: `scale(${isZoomed ? 1.5 : 1}) rotate(${rotation}deg)`,
          }}
          onClick={toggleZoom}
          {...props}
        />
      </div>

      {/* Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-1 bg-black/50 rounded-lg p-1">
          <Button size="icon" variant="ghost" className="h-6 w-6 text-white hover:bg-white/20" onClick={toggleZoom}>
            {isZoomed ? <ZoomOut className="h-3 w-3" /> : <ZoomIn className="h-3 w-3" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6 text-white hover:bg-white/20" onClick={rotate}>
            <RotateCw className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={() => {
              // Download functionality
              const link = document.createElement("a");
              link.href = src;
              link.download = alt;
              link.click();
            }}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Placeholder component for missing images
export function ImagePlaceholder({
  width,
  height,
  className,
  text = "No image",
  icon: Icon = ImageIcon,
}: {
  width?: number;
  height?: number;
  className?: string;
  text?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-muted border border-dashed border-muted-foreground/25 rounded-lg",
        className,
      )}
      style={width && height ? { width, height } : {}}
    >
      <Icon className="h-8 w-8 text-muted-foreground mb-2" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

// Performance monitoring hook
export function useImagePerformance() {
  const [metrics, setMetrics] = useState({
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
  });

  const trackImageLoad = (startTime: number) => {
    const loadTime = Date.now() - startTime;
    setMetrics((prev) => ({
      loadedImages: prev.loadedImages + 1,
      failedImages: prev.failedImages,
      averageLoadTime: (prev.averageLoadTime * (prev.loadedImages - 1) + loadTime) / prev.loadedImages,
    }));
  };

  const trackImageError = () => {
    setMetrics((prev) => ({
      ...prev,
      failedImages: prev.failedImages + 1,
    }));
  };

  return { metrics, trackImageLoad, trackImageError };
}
