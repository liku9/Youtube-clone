import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * Toast Component
 * Themed with semantic yt- classes and responsive scaling.
 */
const Toast = ({ title = "Error", message, onClose }) => {
  const [open,setOpen]=useState(true)
  useEffect(() => {
    // 10-second auto-dismiss
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    open && <div className={`
      absolute bottom-6 right-6 left-6 z-100
      h-auto
      sm:left-auto sm:w-[450px] md:w-[500px]
      animate-slide-up transition-all duration-300
    `}>
      <div className="
        flex items-start gap-4 p-5 
        bg-yt-bg  border-yt-border shadow-2xl
        border-l-4 border-l-yt-primary
      ">
        
        {/* Error Icon - Lucide AlertCircle */}
        <div className="mt-1 text-yt-primary flex-shrink-0">
          <AlertCircle size={24} strokeWidth={2.5} />
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-sm md:text-base font-bold text-yt-text uppercase tracking-widest">
            {title}
          </h3>
          <p className="mt-1.5 text-xs md:text-sm text-yt-muted leading-relaxed">
            {message}
          </p>
        </div>

        {/* Manual Close Button */}
        <button 
          onClick={()=>{onClose();setOpen(!open)}}
          className="p-1 text-yt-muted hover:text-yt-text hover:bg-yt-surface rounded-md transition-all active:scale-90"
        >
          <X size={20} />
        </button>
      </div>

      {/* Optional: Progress Bar for the 10s timer */}
      <div className="absolute bottom-0 left-1 right-0 h-1 bg-yt-primary/20">
        <div 
          className="h-full bg-yt-primary transition-all linear" 
          style={{ animation: 'shrinkWidth 10s linear forwards' }}
        />
      </div>
    </div>
    
  );
};

export default Toast;