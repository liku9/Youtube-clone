import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, Info, X, 
  Sparkles, Zap, Heart, TrendingUp, Award, Bell
} from 'lucide-react';

/**
 * Cinematic Toast Notification Component
 * Features unique YouTube-inspired animations and effects
 */
const Toast = ({ 
  type = 'success', 
  title = '', 
  message = '', 
  duration = 4000,
  onClose = () => {},
  variant = 'slide',
  icon: CustomIcon,
  celebration = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Progress bar countdown
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 400);
  };

  // Toast type configurations
  const configs = {
    success: {
      icon: CustomIcon || CheckCircle,
      bgGradient: 'from-success/20 to-success/20',
      borderColor: 'border-success/40',
      iconColor: 'text-success',
      glowColor: 'shadow-success/30',
      accentColor: 'bg-success',
    },
    error: {
      icon: CustomIcon || XCircle,
      bgGradient: 'from-error/20 to-error/20',
      borderColor: 'border-error/40',
      iconColor: 'text-error',
      glowColor: 'shadow-error/30',
      accentColor: 'bg-error',
    },
   
  };

  const config = configs[type] || configs.success;
  const Icon = config.icon;

  // Animation variants
  const animations = {
    slide: {
      enter: isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
      className: 'transition-all duration-400 ease-out'
    },
    bounce: {
      enter: isVisible && !isExiting ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
      className: 'transition-all duration-400 ease-out'
    },
    fade: {
      enter: isVisible && !isExiting ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
      className: 'transition-all duration-400'
    },
    flip: {
      enter: isVisible && !isExiting ? 'rotateX-0 opacity-100' : 'rotateX-90 opacity-0',
      className: 'transition-all duration-500'
    }
  };

  const anim = animations[variant] || animations.slide;

  return (
  <>
  <div 
    className={`
      fixed z-50 
      /* Positioning: Centered on tiny screens, top-right from 500px up */
      top-4 left-4 right-4 
      min-[500px]:left-auto min-[500px]:top-6 min-[500px]:right-6
      
      /* Sizing: Full width minus margins under 500px, fixed width above */
      w-auto min-[500px]:w-[380px] min-[500px]:max-w-md
      
      ${anim.className} ${anim.enter}
    `}
    style={{ 
      perspective: '1000px',
      transformStyle: 'preserve-3d'
    }}
  >
    <div 
      className={`
        relative
        bg-yt-surface
        backdrop-blur-xl
        border-yt-border border
        rounded-2xl
        shadow-2xl ${config.glowColor}
        overflow-hidden
      `}
    >
      {/* Background patterns - Disabled on mobile for performance/clarity */}
      <div className="absolute inset-0 opacity-5 hidden min-[500px]:block">
        <div className="absolute inset-0 bg-grid-pattern animate-slideDown"></div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>

      {/* Content Container */}
      <div className="relative p-4 min-[500px]:p-5">
        <div className="flex items-start gap-3 min-[500px]:gap-4">
          
          {/* Icon Section */}
          <div className="relative flex-shrink-0 mt-0.5">
            <div className={`absolute inset-0 ${config.accentColor} rounded-full blur-md opacity-50 animate-pulse`}></div>
            <div className={`relative ${config.accentColor} p-2 rounded-xl shadow-lg`}>
              <Icon className="w-5 h-5 min-[500px]:w-6 min-[500px]:h-6 text-white animate-iconBounce" />
            </div>
            {(celebration || type === 'milestone') && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
              </div>
            )}
          </div>

          {/* Text Content - min-w-0 prevents flexbox blowout */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-bold text-sm min-[500px]:text-base text-yt-text mb-0.5 min-[500px]:mb-1.5 animate-slideInLeft truncate">
                {title}
              </h4>
            )}
            {message && (
              <p className="text-xs min-[500px]:text-sm text-yt-muted leading-relaxed animate-slideInLeft line-clamp-2 min-[500px]:line-clamp-none" style={{ animationDelay: '0.1s' }}>
                {message}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-yt-muted hover:text-yt-text transition-all p-1.5 hover:bg-yt-border/30 rounded-full hover:rotate-90 duration-300"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        {duration > 0 && (
          <div className="mt-3 min-[500px]:mt-4 h-1 min-[500px]:h-1.5 bg-yt-border/20 rounded-full overflow-hidden">
            <div 
              className={`h-full ${config.accentColor} rounded-full transition-all duration-50 relative overflow-hidden`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        )}
      </div>

      {/* Top Accent Stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${config.accentColor}`}></div>
    </div>
  </div>

  <style jsx>{`
    /* ... (Previous animations remain the same) ... */
    @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    .animate-shimmer { animation: shimmer 2s infinite; }
    .animate-slideInLeft { animation: slideInLeft 0.4s ease-out forwards; }
    .bg-grid-pattern {
      background-image: 
        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `}</style>
</>
  );
};

export default Toast;