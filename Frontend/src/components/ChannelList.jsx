import React, { useState, useEffect } from 'react';
import { CheckCircle, Settings, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import useFetch from '../hooks/useFetch';

const ChannelList = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  const { data: fetchedChannels, loading: fetchLoading } = useFetch('/api/channels');

  useEffect(() => {
    if (fetchedChannels) {
      setChannels(fetchedChannels);
      setLoading(false);
    } else if (fetchLoading) {
      setLoading(true);
    }
  }, [fetchedChannels, fetchLoading]);

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  if (loading) {
    return <Loading variant="skeleton" type="channel" />;
  }

  if (channels.length === 0) {
    return (
      <div className="bg-yt-bg min-h-screen text-yt-text p-4 sm:p-8">
        <div className="max-w-5xl mx-auto text-center py-16">
          <Users size={48} className="mx-auto mb-4 text-yt-muted opacity-50" />
          <p className="text-lg font-medium text-yt-muted">No channels found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yt-bg min-h-screen text-yt-text p-3 sm:p-4 md:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
          <Users className="text-yt-primary" size={24} />
          <span className="hidden xs:inline">Explore Channels</span>
          <span className="xs:hidden">Channels</span>
        </h2>

        {/* Channel Cards - Responsive Grid */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {channels.map((channel) => {
            // Safely check if the current user is the owner, handling cases where the owner object might be null
            const isOwner = user?.id === (channel.owner?._id || channel.owner);
            
            return (
              <div 
                key={channel._id} 
                onClick={() => handleChannelClick(channel._id)}
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all cursor-pointer ${
                  isOwner 
                    ? 'border-yt-primary bg-yt-primary/5 hover:bg-yt-primary/10' 
                    : 'border-yt-border bg-yt-surface hover:bg-yt-border/30'
                }`}
              >
                {/* Channel Avatar */}
                <div className="flex-shrink-0">
                  <img 
                    src={channel.owner?.avatar || "https://via.placeholder.com/150"} 
                    alt={channel.channelName} 
                    className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-yt-border"
                  />
                </div>

                {/* Channel Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                    <h3 className="text-sm xs:text-base sm:text-lg font-bold text-yt-text truncate">
                      {channel.channelName}
                    </h3>
                    {isOwner && (
                      <CheckCircle 
                        size={16} 
                        className="text-yt-primary flex-shrink-0" 
                        title="Your Channel" 
                      />
                    )}
                  </div>
                  
                  <p className="text-yt-muted text-xs sm:text-sm line-clamp-1 mb-1">
                    @{channel.owner?.username || 'Unknown'} • {channel.subscribers?.toLocaleString() || 0} subscribers
                  </p>
                  
                  <p className="text-yt-text/70 text-xs sm:text-sm line-clamp-1 sm:line-clamp-2 italic hidden xs:block">
                    {channel.description || "No description provided."}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0 ml-2">
                  {isOwner ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/channel/${channel._id}`);
                      }}
                      className="flex items-center justify-center gap-1 sm:gap-1.5 bg-yt-text text-yt-bg px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                    >
                      <Settings size={14} className="hidden xs:block" />
                      <span className="hidden sm:inline">Manage</span>
                      <span className="sm:hidden"><Settings size={14} /></span>
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/channel/${channel._id}`);
                      }}
                      className="bg-yt-surface border border-yt-border text-yt-text px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-yt-border transition-all active:scale-95 whitespace-nowrap"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChannelList;