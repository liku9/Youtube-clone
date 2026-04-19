import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading Component for YouTube Clone
 * 
 * @param {string} variant - Type of loading animation: 'spinner', 'skeleton', 'pulse', 'dots'
 * @param {string} size - Size: 'sm', 'md', 'lg', 'xl', 'full'
 * @param {string} text - Optional loading text to display
 * @param {string} type - Content type for skeleton: 'video', 'channel', 'comment', 'sidebar'
 */
const Loading = ({ 
  variant = 'spinner', 
  size = 'md', 
  text = 'Loading...', 
  type = 'video' 
}) => {
  
  // Spinner Variant
  if (variant === 'spinner') {
    const spinnerSizes = {
      sm: 'w-5 h-5',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
      full: 'w-24 h-24'
    };

    const containerHeights = {
      sm: 'h-32',
      md: 'h-64',
      lg: 'h-96',
      xl: 'h-[32rem]',
      full: 'h-screen'
    };

    return (
      <div className={`flex flex-col items-center justify-center ${containerHeights[size]} bg-transparent`}>
        <Loader2 className={`${spinnerSizes[size]} text-yt-primary animate-spin`} />
        {text && (
          <p className="mt-4 text-yt-muted text-sm sm:text-base font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Dots Variant
  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center h-64 bg-transparent">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-yt-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-yt-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-yt-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  // Pulse Variant
  if (variant === 'pulse') {
    return (
      <div className="flex items-center justify-center h-64 bg-transparent">
        <div className="relative">
          <div className="w-16 h-16 bg-yt-primary rounded-full animate-ping absolute opacity-75"></div>
          <div className="w-16 h-16 bg-yt-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  // Skeleton Variant
  if (variant === 'skeleton') {
    // Video Card Skeleton
    if (type === 'video') {
      return (
        <div className="animate-pulse bg-transparent p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                {/* Thumbnail */}
                <div className="w-full aspect-video bg-yt-surface rounded-xl"></div>
                
                {/* Video Info */}
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-yt-surface rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-yt-surface rounded w-full"></div>
                    <div className="h-3 bg-yt-surface rounded w-3/4"></div>
                    <div className="h-3 bg-yt-surface rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Channel Card Skeleton
    if (type === 'channel') {
      return (
        <div className="animate-pulse bg-transparent p-4">
          <div className="max-w-5xl mx-auto space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-yt-surface rounded-xl">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yt-border rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-yt-border rounded w-1/3"></div>
                  <div className="h-4 bg-yt-border rounded w-1/2"></div>
                  <div className="h-3 bg-yt-border rounded w-2/3"></div>
                </div>
                <div className="h-10 w-24 bg-yt-border rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Comment Skeleton
    if (type === 'comment') {
      return (
        <div className="animate-pulse bg-transparent p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-yt-surface rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-yt-surface rounded w-1/4"></div>
                <div className="h-4 bg-yt-surface rounded w-full"></div>
                <div className="h-4 bg-yt-surface rounded w-5/6"></div>
                <div className="flex gap-4 mt-2">
                  <div className="h-6 bg-yt-surface rounded w-16"></div>
                  <div className="h-6 bg-yt-surface rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Sidebar Skeleton
    if (type === 'sidebar') {
      return (
        <div className="animate-pulse space-y-2 p-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-40 h-24 bg-yt-surface rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-yt-surface rounded w-full"></div>
                <div className="h-3 bg-yt-surface rounded w-3/4"></div>
                <div className="h-2 bg-yt-surface rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  // Default fallback
  return (
    <div className="flex items-center justify-center h-64 bg-transparent">
      <Loader2 className="w-8 h-8 text-yt-primary animate-spin" />
    </div>
  );
};

export default Loading;