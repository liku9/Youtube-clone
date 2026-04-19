import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ThumbsUp, ThumbsDown, Clock, UserCircle
} from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { updateUser } from '../store/authSlice';
import CommentSection from './CommentSection';
import Loading from './Loading';
import useFetch from '../hooks/useFetch';

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [video, setVideo] = useState(null);

  // 1. Initial Video Fetch
  const { data: fetchedVideo, loading: videoLoading } = useFetch(`/api/videos/${id}`);

  useEffect(() => {
    if (fetchedVideo) setVideo(fetchedVideo);
  }, [fetchedVideo]);

  // 2. Memoized Headers
  const headers = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }), []);

  // 3. ACTION HOOKS (Trigger Pattern)
  
  // A. Watch History Trigger
  const { data: historyRes } = useFetch(
    (user && video) ? '/api/actions/watchhistory' : null, 
    'POST', 
    { videoId: id }, 
    headers
  );

  // B. Like Trigger
  const [likeTrigger, setLikeTrigger] = useState(null);
  const { data: likeRes } = useFetch(likeTrigger, 'POST', { videoId: id }, headers);

  // C. Dislike Trigger
  const [dislikeTrigger, setDislikeTrigger] = useState(null);
  const { data: dislikeRes } = useFetch(dislikeTrigger, 'POST', { videoId: id }, headers);

  // D. Subscribe Trigger
  const [subTrigger, setSubTrigger] = useState(null);
  const { data: subRes } = useFetch(subTrigger, 'POST', { channelId: video?.channel?._id }, headers);

  // E. Watch Later Trigger
  const [laterTrigger, setLaterTrigger] = useState(null);
  const { data: laterRes } = useFetch(laterTrigger, 'POST', { videoId: id }, headers);

  // 4. STATUS CHECKS
  const isLiked = useMemo(() => user?.likedVideos?.some(v => v._id === id), [user, id]);
  const isDisliked = useMemo(() => user?.dislikedVideos?.some(v => v._id === id), [user, id]);
  const isSubscribed = useMemo(() => user?.subscribedChannels?.some(c => c._id === video?.channel?._id), [user, video]);
  const isInWatchLater = useMemo(() => user?.watchLater?.some(v => v._id === id), [user, id]);

  // 5. RESPONSE LISTENERS (Sync Redux and Local UI)
  useEffect(() => {
    const responses = [
      { res: historyRes },
      { res: likeRes, type: 'like' },
      { res: dislikeRes, type: 'dislike' },
      { res: subRes, type: 'sub' },
      { res: laterRes }
    ];

    responses.forEach(({ res, type }) => {
      if (res?.user) {
        dispatch(updateUser(res.user));
        
        // Handle local UI increments/decrements
        if (type === 'like') {
          setVideo(prev => ({ ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 }));
          setLikeTrigger(null);
        }
        if (type === 'dislike') {
          if (isLiked) setVideo(prev => ({ ...prev, likes: prev.likes - 1 }));
          setDislikeTrigger(null);
        }
        if (type === 'sub') {
          setVideo(prev => ({
            ...prev,
            channel: { ...prev.channel, subscribers: isSubscribed ? prev.channel.subscribers - 1 : prev.channel.subscribers + 1 }
          }));
          setSubTrigger(null);
        }
      }
    });
  }, [historyRes, likeRes, dislikeRes, subRes, laterRes]);

  // 6. HANDLERS
  const handleLike = () => !user ? alert("Login to like") : setLikeTrigger('/api/actions/likes');
  const handleDislike = () => !user ? alert("Login to dislike") : setDislikeTrigger('/api/actions/dislikes');
  const handleSubscribe = () => !user ? alert("Login to subscribe") : setSubTrigger('/api/actions/subscribe');
  const handleWatchLater = () => !user ? alert("Login to use Watch Later") : setLaterTrigger('/api/actions/watchlater');

  if (videoLoading) return <Loading variant="spinner" size="lg" text="Loading video..." />;
  if (!video) return <div className="p-10 text-center text-yt-text">Video not found.</div>;

  return (
    <div className="w-full   rounded-xl flex flex-col gap-4 bg-yt-bg text-yt-text transition-colors duration-300">
      <div className="w-full aspect-video bg-black overflow-hidden rounded-none sm:rounded-xl">
        <VideoPlayer src={video.videoUrl} />
      </div>

      <div className="px-4 sm:px-0">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-yt-text line-clamp-2 mb-3">
          {video.title}
        </h1>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                {video.channel?.owner?.avatar ? (
                  <img src={video.channel.owner.avatar} className="h-10 w-10 rounded-full object-cover border border-yt-border" alt="Channel" />
                ) : (
                  <UserCircle size={40} strokeWidth={1.5} className="text-yt-muted" />
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-bold text-sm sm:text-base truncate">{video.channel?.channelName || "Unknown Channel"}</h3>
                <p className="text-xs text-yt-muted">{video.channel?.subscribers?.toLocaleString() || "0"} subscribers</p>
              </div>
            </div>

            <button 
              onClick={handleSubscribe}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                isSubscribed ? "bg-yt-surface text-yt-text border border-yt-border" : "bg-yt-text text-yt-bg"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-yt-surface rounded-full border border-yt-border overflow-hidden">
              <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 hover:bg-yt-border transition-colors border-r border-yt-border ${isLiked ? "text-yt-text bg-white/10" : ""}`}>
                <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
                <span className="text-sm font-bold">{video.likes?.toLocaleString()}</span>
              </button>
              <button onClick={handleDislike} className={`px-4 py-2 hover:bg-yt-border transition-colors ${isDisliked ? "text-yt-text bg-white/10" : ""}`}>
                <ThumbsDown size={18} fill={isDisliked ? "currentColor" : "none"} />
              </button>
            </div>

            <button 
              onClick={handleWatchLater}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                isInWatchLater ? "bg-yt-surface text-yt-primary border-yt-primary" : "bg-yt-surface text-yt-text border-yt-border hover:bg-yt-border"
              }`}
            >
              <Clock size={18} className={isInWatchLater ? "fill-current" : ""} />
              <span className="whitespace-nowrap">{isInWatchLater ? "Saved" : "Watch Later"}</span>
            </button>

            <button onClick={() => navigate(`/channel/${video.channel?._id}`)} className="px-4 py-2 bg-yt-surface rounded-full border border-yt-border hover:bg-yt-border text-sm font-bold">
              Channel
            </button>
          </div>
        </div>
      </div>

      <div className="mx-4 sm:mx-0 bg-yt-surface rounded-xl p-4 text-sm border border-yt-border">
        <div className="flex flex-wrap gap-3 font-bold mb-2 text-xs">
          <span>{video.views?.toLocaleString()} views</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          <span className="text-yt-muted">#{video.category}</span>
        </div>
        <p className="whitespace-pre-line text-yt-text/90 line-clamp-3">{video.description}</p>
      </div>

      <div className="mx-4 sm:mx-0">
        <CommentSection currentUser={user} videoId={video._id} />
      </div>
    </div>
  );
};

export default VideoPage;