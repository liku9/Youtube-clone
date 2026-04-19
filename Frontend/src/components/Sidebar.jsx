import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Home, 
  Clock,  
  ThumbsUp, 
  Video, 
  ChevronDown, 
  UserCircle, 
  ThumbsDown
} from 'lucide-react';

/**
 * YouTubeSidebar Component
 * Integrated with v4.1 custom animations and scrollbar-yt.
 */


export default function YouTubeSidebar({ isOpen, onClose }) {
  const user = useSelector(state => state.auth.user);
  const [showAllSubs, setShowAllSubs] = useState(false);

  const subscriptions =user?.subscribedChannels 
console.log(user)
  const visibleSubs = showAllSubs ? subscriptions : subscriptions?.slice(0, 6);

  const youItems = [
    { icon: Clock, label: 'History' },
    { icon: Clock, label: 'Watch Later' },
    { icon: ThumbsUp, label: 'Liked videos' },
    { icon: ThumbsDown, label: 'Disliked Videos' },
  ];

  return (
    <>
      {/* Mobile Overlay - uses the new animate-fade-in */}
      {isOpen && (
        <div 
          className="animate-fade-in fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - uses the new scrollbar-yt */}
      <aside 
  className={`
    fixed top-14 left-0 
    w-64 h-[calc(100vh-3.5rem)] 
  xxs:h-[calc(100%-3.5rem)]
    overflow-y-auto scrollbar-yt
    z-50 
    transition-transform duration-300 ease-in-out
    /* Toggle transform based on isOpen prop */
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    bg-yt-bg border-r border-yt-border
    flex flex-col transition-colors duration-300
  `}
>
        <div className="px-3 py-2 flex-1">
          
          {/* Home Item - First to slide in */}
          <div className="animate-slide-in flex items-center gap-5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-yt-surface text-yt-text transition-colors">
            <Home size={22} strokeWidth={2} />
            <Link to="/">
            <span className="text-[14px] font-medium">Home</span>
            </Link>
          </div>

           <div className="animate-slide-in flex items-center gap-5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-yt-surface text-yt-text transition-colors">
            <Video size={22} strokeWidth={2} />
            <Link to="/channel">
            
            <span className="text-[14px] font-medium">Explore</span>
            </Link>
          </div>
          <div className="h-px my-3 bg-yt-border" />

          {/* You Section - Staggered delay */}
          <div 
            className="animate-slide-in px-3 py-2 text-yt-text"
            style={{ animationDelay: '100ms' }}
          >
            <h2 className="text-[15px] font-semibold">You</h2>
          </div>

          <div className="space-y-0.5 animate-slide-in" style={{ animationDelay: '150ms' }}>
            {user && (
              <Link
                to={user.channel ? (typeof user.channel === 'string' ? `/channel/${user.channel}` : `/channel/${user.channel._id}`) : '/studio/createChannel'}
                className="flex items-center gap-5 px-3 py-2 rounded-lg cursor-pointer hover:bg-yt-surface text-yt-text"
              >
                <UserCircle size={22} strokeWidth={2} />
                <span className="text-[14px] font-medium">{user.channel ? "Your channel" : "Create Channel"}</span>
              </Link>
            )}

            {youItems.map((item, index) => {
              const Icon = item.icon;
              return (

                
                <Link  key={item.label}  to="/studio/manageAccount">
                <div
                 
                  className="flex items-center gap-5 px-3 py-2 rounded-lg cursor-pointer hover:bg-yt-surface text-yt-text"
                >
                  <Icon size={22} strokeWidth={2} />
                  <span className="text-[14px] font-medium">{item.label}</span>
                
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="h-px my-3 bg-yt-border" />

          {/* Subscriptions Section - Further staggered */}
          <div 
            className="animate-slide-in px-3 py-2 text-yt-text"
            style={{ animationDelay: '200ms' }}
          >
            <h2 className="text-[15px] font-semibold">Subscriptions</h2>
          </div>

          <div className="space-y-0.5 animate-slide-in" style={{ animationDelay: '250ms' }}>
            {visibleSubs?.map((sub, index) => (
              <div
                 key={sub._id}
                className="flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer hover:bg-yt-surface text-yt-text group"
              >
                <div className="w-6 h-6 flex items-center justify-center text-sm rounded-full bg-yt-surface border border-yt-border">
                   <div className="w-6 h-6 rounded-full overflow-hidden border border-yt-border flex-shrink-0 bg-yt-bg">
                      <img 
                        src={sub.channelBanner || `https://api.dicebear.com/7.x/initials/svg?seed=${sub.channelName}`} 
                        className="w-full h-full object-cover" 
                        alt={sub.channelName} 
                      />
                    </div>
                </div>
                <span className="text-[14px] flex-1 truncate">{sub.channelName}</span>
                
              </div>
            ))}
            
            <button
              onClick={() => setShowAllSubs(!showAllSubs)}
              className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-yt-surface text-yt-text"
            >
              <ChevronDown 
                size={20} 
                className={`transition-transform duration-300 ${showAllSubs ? 'rotate-180' : ''}`} 
              />
              <span className="text-[14px] font-medium">
                {showAllSubs ? 'Show less' : 'Show more'}
              </span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <footer className="animate-slide-in px-6 py-4 mt-auto text-[11px] font-medium text-yt-muted border-t border-yt-border transition-colors duration-300" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
            <a href="#" className="hover:text-yt-text">About</a>
            <a href="#" className="hover:text-yt-text">Press</a>
            <a href="#" className="hover:text-yt-text">Copyright</a>
          </div>
          <p>© 2026 YOUTUBE INDIA</p>
        </footer>
      </aside>
    </>
  );
}