import React, { useState, useEffect, useMemo } from 'react';
import { ListFilter, Pencil, Check, X, Trash2 } from 'lucide-react';
import useFetch from '../hooks/useFetch';

const CommentSection = ({ videoId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 1. Memoized Headers for all mutations
  const headers = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }), []);

  // 2. FETCH: Initial comments load
  const { data: fetchedComments } = useFetch(videoId ? `/api/comments/${videoId}` : null);

  useEffect(() => {
    if (fetchedComments) setComments(fetchedComments);
  }, [fetchedComments]);

  // 3. POST: Add Comment
  const [postTrigger, setPostTrigger] = useState(null);
  const { data: postRes } = useFetch(
    postTrigger, 
    'POST', 
    { text: newComment, videoId }, 
    headers
  );

  useEffect(() => {
    if (postRes) {
      setComments(prev => [postRes, ...prev]);
      setNewComment("");
      setPostTrigger(null);
    }
  }, [postRes]);

  // 4. PATCH: Edit Comment
  const [patchTrigger, setPatchTrigger] = useState(null);
  const { data: patchRes } = useFetch(
    patchTrigger, 
    'PATCH', 
    { text: editText }, 
    headers
  );

  useEffect(() => {
    if (patchRes) {
      setComments(prev => prev.map(c => (c._id === editingId ? patchRes : c)));
      setEditingId(null);
      setPatchTrigger(null);
    }
  }, [patchRes, editingId]);

  // 5. DELETE: Remove Comment
  const [deleteId, setDeleteId] = useState(null);
  const { data: deleteRes } = useFetch(
    deleteId ? `/api/comments/${deleteId}` : null, 
    'DELETE', 
    null, 
    headers
  );

  useEffect(() => {
    if (deleteRes || (deleteId && !deleteRes && deleteRes !== undefined)) { 
      // Note: Delete often returns 204 No Content, check hook behavior
      setComments(prev => prev.filter(c => c._id !== deleteId));
      setDeleteId(null);
    }
  }, [deleteRes, deleteId]);

  // --- Handlers ---
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setPostTrigger(`/api/comments`);
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setPatchTrigger(`/api/comments/${id}`);
  };

  const handleDeleteComment = (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setDeleteId(id);
    }
  };

  return (
    <div className="mt-6 border-t border-yt-border pt-6 max-w-4xl bg-yt-bg text-yt-text transition-colors">
      <div className="flex items-center gap-8 mb-6">
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>
        <button className="text-sm font-medium text-yt-text flex items-center gap-2 hover:bg-yt-surface px-3 py-1 rounded-full">
          <ListFilter size={20} /> Sort by
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <img src={currentUser?.avatar} className="h-10 w-10 rounded-full border border-yt-border object-cover" alt="User" />
        <div className="flex-1 group">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-yt-border py-1 focus:border-yt-text outline-none text-sm"
          />
          <div className="flex justify-end gap-3 mt-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
            <button onClick={() => setNewComment("")} className="px-4 py-2 text-sm font-bold hover:bg-yt-surface rounded-full">
              Cancel
            </button>
            <button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 text-sm font-bold bg-yt-primary text-white rounded-full disabled:bg-yt-surface disabled:text-yt-muted"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4 group">
            <img src={comment.user?.avatar} className="h-10 w-10 rounded-full object-cover bg-yt-surface" alt="" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold">@{comment.user?.username || "user"}</span>
                <span className="text-xs text-yt-muted">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>

              {editingId === comment._id ? (
                <div className="flex items-center gap-2 bg-yt-surface p-2 rounded-md border border-yt-primary/30">
                  <input 
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(comment._id)}
                  />
                  <button onClick={() => saveEdit(comment._id)} className="text-green-500 p-1">
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-yt-primary p-1">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="relative pr-10">
                  <p className="text-sm leading-relaxed">{comment.text}</p>
                  {(currentUser?.id === comment.user?._id) && (
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(comment)} className="p-2 text-yt-muted hover:text-yt-text">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)} className="p-2 text-yt-muted hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-yt-muted font-bold">
                <button className="hover:text-yt-text">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;