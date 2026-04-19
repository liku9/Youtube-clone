import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LogOut, Search, Sun, Moon, Settings, 
  UserPen, MonitorPlay, ChevronLeft 
} from 'lucide-react';
import { clearAuth } from '../store/authSlice';

const Header = ({ onMenuClick, searchTerm, setSearchTerm }) => {
  const [isSearchClicked, setSearchClicked] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleChange = (e) => setSearchTerm(e.target.value);

  useEffect(() => {
    const root = document.documentElement;
    isDarkMode ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b border-yt-border bg-yt-bg/95 backdrop-blur-md px-2 transition-all duration-300 sm:px-4">
      
      {/* --- Left Section: Menu & Logo --- */}
      <div className={`flex items-center gap-1 sm:gap-4 ${isSearchClicked ? 'hidden sm:flex' : 'flex'}`}>
        <button
          onClick={onMenuClick}
          className="rounded-full p-2 text-yt-text hover:bg-yt-surface transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-1 group">
          <div className="rounded-lg bg-yt-primary p-1 group-active:scale-90 transition-transform">
            <svg className="h-4 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <span className="hidden font-bold tracking-tighter text-yt-text text-xl xxs:block">
            YouTube<sup className="ml-0.5 font-medium text-yt-muted text-[10px]">IN</sup>
          </span>
        </Link>
      </div>

      {/* --- Center Section: Search --- */}
      <div className={`flex-grow justify-center px-4 ${isSearchClicked ? 'flex' : 'hidden sm:flex'}`}>
        <div className="flex w-full max-w-[600px] items-center">
          {isSearchClicked && (
            <button onClick={() => setSearchClicked(false)} className="mr-2 p-2 text-yt-text sm:hidden">
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex w-full overflow-hidden rounded-full border border-yt-border bg-yt-surface/30 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <input
              autoFocus={isSearchClicked}
              onChange={handleChange}
              type="text"
              placeholder="Search"
              className="w-full bg-transparent px-4 py-1.5 text-sm text-yt-text outline-none placeholder-yt-muted"
            />
            <button className="border-l border-yt-border bg-yt-surface px-5 hover:bg-yt-border/50 transition-colors">
              <Search className="h-5 w-5 text-yt-text" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Right Section: Actions --- */}
      <div className={`items-center gap-1 sm:gap-2 ${isSearchClicked ? 'hidden sm:flex' : 'flex'}`}>
        <button 
          onClick={() => setSearchClicked(true)} 
          className="p-2 text-yt-text hover:bg-yt-surface rounded-full sm:hidden"
        >
          <Search size={20} />
        </button>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 text-yt-text hover:bg-yt-surface rounded-full transition-all"
        >
          {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
        </button>

        {!user ? (
          <button
            onClick={() => navigate('/login')}
            className="ml-2 flex items-center gap-2 rounded-full border border-yt-border px-3 py-1.5 text-yt-primary hover:bg-yt-primary/10 transition-all font-medium text-sm"
          >
            Sign in
          </button>
        ) : (
          <div className="flex items-center gap-4 ml-1 sm:ml-4 group relative py-2">
            {/* Username Display (Hidden on very small screens) */}
            <span className="hidden md:block text-sm font-medium mr-2 text-yt-text">
              {user.username}
            </span>

            {/* Avatar Trigger */}
            <img
              src={user.avatar || 'https://via.placeholder.com/32'}
              className="h-8 w-8 rounded-full border border-yt-border object-cover cursor-pointer hover:ring-4 hover:ring-yt-surface transition-all"
              alt="Profile"
            />

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-72 origin-top-right rounded-2xl border border-yt-border bg-yt-bg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-[200]">
              <div className="flex items-center gap-4 p-4 border-b border-yt-border bg-yt-surface/20">
                <img src={user.avatar} className="h-12 w-12 rounded-full object-cover" alt="Large Avatar" />
                <div className="overflow-hidden">
                  <p className="font-bold text-yt-text truncate">{user.username}</p>
                  <p className="text-xs text-yt-muted truncate">{user.email}</p>
                </div>
              </div>

              <div className="p-2">
                <MenuLink to="/studio/manageAccount" icon={<Settings size={18} />} label="Manage Profile" />
                <MenuLink to="/studio/updateProfile" icon={<UserPen size={18} />} label="Update Profile" />
                
                <div className="my-2 border-t border-yt-border" />
                
                <MenuLink 
                  to={user.channel ? `/channel/${user.channel._id}` : "/studio/createChannel"} 
                  icon={<MonitorPlay size={18} className="text-yt-primary" />} 
                  label={user.channel ? "Your Channel" : "Create a Channel"} 
                />

                <button 
                  onClick={() => dispatch(clearAuth())}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={18} /> Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Helper component for clean menu items
const MenuLink = ({ to, icon, label }) => (
  <Link 
    to={to} 
    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-yt-text hover:bg-yt-surface transition-colors"
  >
    <span className="text-yt-muted">{icon}</span>
    {label}
  </Link>
);

export default Header;