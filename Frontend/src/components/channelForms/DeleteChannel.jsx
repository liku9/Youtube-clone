import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../store/authSlice';
import useFetch from '../../hooks/useFetch'; // Assuming your hook path

const SecureDeleteChannel = ({ channelId, onClose }) => {
  const [key, setKey] = useState('');
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  // 1. Prepare Memoized Headers and Body
  const headers = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }), []);

  // We wrap the key in an object because your controller expects { uniqueDeleteKey: ... }
  const requestBody = useMemo(() => ({
    uniqueDeleteKey: key
  }), [key]);

  // 2. Setup useFetch for DELETE
  const [triggerPath, setTriggerPath] = useState(null);
  const { data, loading, error } = useFetch(
    triggerPath, 
    'DELETE', 
    requestBody, 
    headers
  );

  // 3. Handle response lifecycle
  useEffect(() => {
    if (data) {
      // Update local Redux state
      if (user) {
        dispatch(updateUser({ ...user, channel: null }));
      }
      // Hard redirect to home to clear all states
      window.location.href = '/';
    }

    if (error) {
      alert(error.response?.data?.message || "Invalid Key");
      setTriggerPath(null); // Reset trigger so user can try again
    }
  }, [data, error, dispatch, user]);

  const handleDeleteClick = () => {
    if (!key) return;
    setTriggerPath(`/api/channels/${channelId}`);
  };

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-yt-bg border border-yt-border w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-6">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-red-500/10 rounded-full text-red-500">
            <AlertTriangle size={32} />
          </div>
          <button 
            onClick={onClose} 
            className="text-yt-muted hover:text-yt-text transition-colors"
          >
            <X />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-yt-text uppercase tracking-tight">Extreme Action</h3>
          <p className="text-yt-muted text-sm">
            Deleting your channel will remove <span className="text-red-400 font-bold">all videos</span> and <span className="text-red-400 font-bold">subscribers</span> permanently.
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black text-yt-muted uppercase">Enter Unique Delete Key</label>
          <input 
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl text-yt-text outline-none focus:border-yt-primary transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          onClick={handleDeleteClick}
          disabled={!key || loading}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Confirm Permanent Deletion"}
        </button>
      </div>
    </div>
  );
};

export default SecureDeleteChannel;