import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPen, Mail, AtSign, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../store/authSlice';
import Toast from '../SuccessToast';
import useFetch from '../../hooks/useFetch'; // Assuming your hook path

const UpdateProfile = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  // 1. Memoize headers for useFetch
  const headers = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }), []);

  // 2. Setup useFetch for the PUT request
  const [triggerPath, setTriggerPath] = useState(null);
  const { data, loading, error } = useFetch(
    triggerPath, 
    'PUT', 
    formData, 
    headers
  );

  // 3. Handle response lifecycle
  useEffect(() => {
    if (data?.user) {
      setToast({ type: "success", title: "Success", message: "Profile updated successfully!" });
      
      // Update global context so the header avatar changes immediately
      dispatch(updateUser(data.user)); 

      setTimeout(() => navigate(-1), 1500);
    }

    if (error) {
      setToast({ 
        type: "error",
        title: "Update Error", 
        message: error.response?.data?.message || "Failed to update profile." 
      });
      setTriggerPath(null); // Reset trigger so user can retry
    }
  }, [data, error, dispatch, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTriggerPath('/api/auth/update');
  };

  return (
    <div className="bg-yt-bg min-h-screen p-3 sm:p-6 md:p-8 transition-colors duration-300">
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="max-w-xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-yt-muted hover:text-yt-text mb-4 sm:mb-6 font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-yt-surface border border-yt-border rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 sm:mb-8 md:mb-10 flex items-center gap-2 sm:gap-3 text-yt-text">
            <UserPen className="text-yt-primary" size={20} /> 
            <span className="hidden xs:inline">Personal Info</span>
            <span className="xs:hidden">Profile</span>
          </h2>

          {/* Live Preview Circle */}
          <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-10 space-y-3 sm:space-y-4">
            <div className="relative group">
              <img 
                src={formData.avatar || 'https://via.placeholder.com/150'} 
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-yt-bg object-cover shadow-xl transition-transform group-hover:scale-105"
                alt="Avatar Preview"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[10px] text-white font-black uppercase">Preview</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-yt-text font-bold text-base sm:text-lg">
                {formData.username || "Username"}
              </p>
              <p className="text-yt-muted text-xs sm:text-sm">
                {formData.email || "email@example.com"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1 flex items-center gap-2">
                <AtSign size={12} /> Display Name
              </label>
              <input 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-3 sm:p-4 rounded-lg sm:rounded-xl md:rounded-2xl outline-none focus:border-yt-primary text-yt-text font-medium text-sm sm:text-base transition-colors"
                placeholder="How should we call you?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1 flex items-center gap-2">
                <Mail size={12} /> Email Address
              </label>
              <input 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-3 sm:p-4 rounded-lg sm:rounded-xl md:rounded-2xl outline-none focus:border-yt-primary text-yt-text font-medium text-sm sm:text-base transition-colors"
                placeholder="yourname@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1 flex items-center gap-2">
                <ImageIcon size={12} /> Avatar Image URL
              </label>
              <input 
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-3 sm:p-4 rounded-lg sm:rounded-xl md:rounded-2xl outline-none focus:border-yt-primary text-yt-text font-medium text-sm sm:text-base transition-colors"
                placeholder="https://images.com/my-photo.png"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yt-text text-yt-bg font-bold sm:font-black py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wide sm:tracking-[0.15em] mt-4 shadow-lg text-sm sm:text-base disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;