import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, AlertTriangle, XCircle, Ban, WifiOff } from 'lucide-react';

/**
 * Error Page Component for YouTube Clone
 * 
 * @param {string|number} status - HTTP status code (404, 500, 403, etc.)
 * @param {string} title - Error title
 * @param {string} message - Error message description
 * @param {string} homeRoute - Route to navigate on home button click (default: '/')
 */
const ErrorPage = ({ 
  status,
  title,
  message,
  homeRoute = '/'
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get error details from location state or props
  const errorState = location.state;
  const finalStatus = status || errorState?.status || '404';
  const finalTitle = title || errorState?.title || 'Page Not Found';
  const finalMessage = message || errorState?.message || 'The page you are looking for does not exist or has been moved.';

  // Get appropriate icon based on error status
  const getErrorIcon = () => {
    const statusNum = parseInt(finalStatus);
    
    if (statusNum === 404) return XCircle;
    if (statusNum === 403 || statusNum === 401) return Ban;
    if (statusNum >= 500) return AlertTriangle;
    if (statusNum === 0 || finalStatus === 'offline') return WifiOff;
    return AlertTriangle;
  };

  const ErrorIcon = getErrorIcon();

  return (
    <div className="min-h-screen bg-yt-bg flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <div className="w-full max-w-2xl">
        {/* Error Container */}
        <div className="bg-yt-surface border-2 border-yt-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
          
          {/* Y|C Branding Header */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="text-yt-primary/20 font-black text-2xl sm:text-3xl md:text-4xl tracking-wider">
              Y<span className="text-yt-muted/20">|</span>C
            </div>
          </div>

          {/* Error Status with Icon */}
          <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-10">
            {/* Icon with animated background */}
            <div className="relative mb-4 sm:mb-6">
              {/* Pulsing glow */}
              <div className="absolute inset-0 bg-yt-primary/20 rounded-full blur-2xl animate-pulse"></div>
              
              {/* Icon container */}
              <div className="relative bg-yt-primary/10 border-2 border-yt-primary/30 rounded-full p-4 sm:p-6 md:p-8">
                <ErrorIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-yt-primary" strokeWidth={1.5} />
              </div>
            </div>

            {/* Status Code */}
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-yt-primary mb-2 sm:mb-3 tracking-tight">
              {finalStatus}
            </div>

            {/* Animated underline */}
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-yt-primary rounded-full"></div>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yt-text text-center mb-3 sm:mb-4 px-2">
            {finalTitle}
          </h1>

          {/* Error Message */}
          <p className="text-sm sm:text-base md:text-lg text-yt-muted text-center leading-relaxed mb-8 sm:mb-10 md:mb-12 px-4 sm:px-6 max-w-xl mx-auto">
            {finalMessage}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            {/* Home Button */}
            <button
              onClick={() => navigate(homeRoute)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-yt-primary text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-yt-primary/30"
            >
              <Home size={20} className="sm:w-5 sm:h-5" />
              <span>Go to Home</span>
            </button>

            {/* Go Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-yt-surface border-2 border-yt-border text-yt-text px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-yt-border transition-all"
            >
              <span>Go Back</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-yt-border">
            <p className="text-xs sm:text-sm text-yt-muted text-center">
              If you believe this is a mistake, please contact support or try again later.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-6 sm:mt-8 flex justify-center gap-2 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-yt-border rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;