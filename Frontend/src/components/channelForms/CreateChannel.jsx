import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, KeyRound } from 'lucide-react';
import Toast from '../SuccessToast';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/authSlice';
import useFetch from '../../hooks/useFetch'; // Assuming your hook path

const CreateChannel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    channelName: '', description: '', channelBanner: '', uniqueDeleteKey: ''
  });

  // 1. Prepare Memoized Headers
  const headers = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }), []);

  // 2. Setup Hook for Channel Creation
  const [createTrigger, setCreateTrigger] = useState(null);
  const { 
    data: createData, 
    loading: createLoading, 
    error: createError 
  } = useFetch(createTrigger, 'POST', formData, headers);

  // 3. Setup Hook for Refreshing User Data
  const [refreshTrigger, setRefreshTrigger] = useState(null);
  const { 
    data: updatedUserData, 
    error: refreshError 
  } = useFetch(refreshTrigger, 'GET', null, headers);

  // 4. Step 1 Listener: After Channel is Created
  useEffect(() => {
    if (createData) {
      // Trigger the second fetch to get the updated user profile
      setRefreshTrigger('/api/auth/me');
    }
    if (createError) {
      setToast({ type: "error", title: "Error", message: createError.response?.data?.message || "Creation failed" });
      setCreateTrigger(null);
    }
  }, [createData, createError]);

  // 5. Step 2 Listener: After User Data is Refreshed
  useEffect(() => {
    if (updatedUserData) {
      dispatch(updateUser(updatedUserData));
      setToast({ type: "success", title: "Success", message: "Channel created! Redirecting..." });
      
      // Redirect using the new channel ID from the refreshed user data
      setTimeout(() => navigate(`/channel/${updatedUserData.channel._id}`), 1500);
    }
    if (refreshError) {
      setToast({ type: "error", title: "Sync Error", message: "Channel created but failed to sync user data." });
    }
  }, [updatedUserData, refreshError, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.channelName || !formData.uniqueDeleteKey) {
      setToast({ type: "error", title: "Missing Info", message: "Please fill in required fields." });
      return;
    }
    setCreateTrigger('/api/channels');
  };

  return (
    <div className="bg-yt-bg min-h-screen p-4 xxs:p-8">
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold text-yt-text flex items-center gap-2">
          <Layout className="text-yt-primary"/> Start Your Journey
        </h2>
        
        {/* Banner Preview */}
        <div className="w-full h-32 xxs:h-48 bg-yt-surface rounded-2xl overflow-hidden border border-yt-border">
          {formData.channelBanner ? (
            <img src={formData.channelBanner} className="w-full h-full object-cover" alt="Banner Preview" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-yt-muted text-xs uppercase font-bold">
              Banner Preview
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            placeholder="Channel Name*" 
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl outline-none focus:border-yt-primary text-yt-text"
            onChange={(e) => setFormData({...formData, channelName: e.target.value})}
          />
          <textarea 
            placeholder="Tell us about your channel..." 
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl h-24 outline-none text-yt-text"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <input 
            placeholder="Banner Image URL" 
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl outline-none text-yt-text"
            onChange={(e) => setFormData({...formData, channelBanner: e.target.value})}
          />
          
          <div className="p-4 bg-yt-primary/5 border border-yt-primary/20 rounded-xl space-y-2">
            <label className="text-xs font-bold text-yt-primary flex items-center gap-1 uppercase">
              <KeyRound size={14}/> Security Key (For Deletion)
            </label>
            <input 
              type="password"
              placeholder="Enter a key you won't forget" 
              className="w-full bg-yt-bg border border-yt-border p-3 rounded-lg outline-none text-yt-text"
              onChange={(e) => setFormData({...formData, uniqueDeleteKey: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={createLoading}
            className="w-full bg-yt-text text-yt-bg font-bold py-4 rounded-xl hover:opacity-90 transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {createLoading ? "Creating..." : "Launch Channel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;