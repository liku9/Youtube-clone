import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/authSlice';
import Toast from '../SuccessToast';
import { Edit3, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import useFetch from '../../hooks/useFetch'; // Assuming your hook path

const UpdateChannel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);

  const channelData = location.state?.channel;

  const [formData, setFormData] = useState({
    channelName: channelData?.channelName || '',
    description: channelData?.description || '',
    channelBanner: channelData?.channelBanner || '',
  });

  // Security: Redirect if accessed without channel data
  useEffect(() => {
    if (!channelData) navigate(-1);
  }, [channelData, navigate]);

  // 1. Memoize headers for useFetch stability
  const headers = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }), []);

  // 2. Setup Hook for Channel Update (PUT)
  const [updateTrigger, setUpdateTrigger] = useState(null);
  const { 
    data: updateResponse, 
    loading: updateLoading, 
    error: updateError 
  } = useFetch(updateTrigger, 'PUT', formData, headers);

  // 3. Setup Hook for Refreshing User Data (GET)
  const [refreshTrigger, setRefreshTrigger] = useState(null);
  const { 
    data: refreshedUser, 
    error: refreshError 
  } = useFetch(refreshTrigger, 'GET', null, headers);

  // 4. Step 1 Listener: After PUT succeeds
  useEffect(() => {
    if (updateResponse) {
      setRefreshTrigger('/api/auth/me');
    }
    if (updateError) {
      setToast({ 
        type: "error", 
        title: "Update Error", 
        message: updateError.response?.data?.message || "Failed to save changes." 
      });
      setUpdateTrigger(null); // Reset trigger
    }
  }, [updateResponse, updateError]);

  // 5. Step 2 Listener: After GET profile succeeds
  useEffect(() => {
    if (refreshedUser) {
      dispatch(updateUser(refreshedUser));
      setToast({ type: "success", title: "Updated", message: "Channel details refreshed successfully!" });
      setTimeout(() => navigate(`/channel/${channelData._id}`), 1500);
    }
    if (refreshError) {
      setToast({ type: "error", title: "Sync Error", message: "Update saved but failed to sync profile." });
    }
  }, [refreshedUser, refreshError, dispatch, navigate, channelData?._id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUpdateTrigger(`/api/channels/${channelData._id}`);
  };

  return (
    <div className="bg-yt-bg min-h-screen p-3 sm:p-6 md:p-8 transition-colors duration-300">
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-yt-muted hover:text-yt-text mb-4 sm:mb-6 transition-colors font-bold text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-yt-surface border border-yt-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-yt-text">
            <Edit3 className="text-yt-primary" size={20} /> 
            <span className="hidden xs:inline">Customize Channel</span>
            <span className="xs:hidden">Edit Channel</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1 flex items-center gap-2">
                <ImageIcon size={12} /> Channel Banner
              </label>
              <div className="relative w-full h-24 sm:h-32 md:h-40 bg-yt-bg rounded-lg sm:rounded-xl overflow-hidden border border-yt-border group">
                {formData.channelBanner ? (
                  <img 
                    src={formData.channelBanner} 
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" 
                    alt="Banner Preview" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-yt-muted text-xs font-bold">
                    NO BANNER SET
                  </div>
                )}
              </div>
              <input 
                name="channelBanner"
                value={formData.channelBanner}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="w-full bg-yt-bg border border-yt-border p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:border-yt-primary text-yt-text transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1">Channel Name</label>
              <input 
                name="channelName"
                value={formData.channelName}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-3 sm:p-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg outline-none focus:border-yt-primary text-yt-text transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-3 sm:p-4 rounded-lg sm:rounded-xl h-28 sm:h-36 md:h-40 text-xs sm:text-sm outline-none focus:border-yt-primary text-yt-text leading-relaxed transition-colors resize-none"
                placeholder="Describe your channel to your audience..."
              />
            </div>

            <button 
              type="submit" 
              disabled={updateLoading}
              className="w-full bg-yt-text text-yt-bg font-bold sm:font-black py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wide sm:tracking-[0.15em] shadow-lg text-sm sm:text-base disabled:opacity-50"
            >
              {updateLoading ? "Saving Changes..." : "Update Channel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateChannel;