import React, { useEffect, useState, useMemo } from 'react';
import VideoGrid from '../components/VideoGrid';
import { useOutletContext } from 'react-router-dom';
import Loading from '../components/Loading';
import useFetch from '../hooks/useFetch';

const HomePage = () => {
  const { searchTerm = "" } = useOutletContext();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: fetchedVideos, loading: fetchLoading } = useFetch('/api/videos');

  useEffect(() => {
    if (fetchedVideos) {
      setVideos(fetchedVideos);
      localStorage.setItem('yt_videos_cache', JSON.stringify(fetchedVideos));
      setLoading(false);
    } else if (!fetchLoading) {
       // Finished loading but no data? (Maybe error or empty)
       // Or check cache if fetchLoading is true?
       // Actually, useFetch initializes loading=true.
       // If we have cache, we can show it while fetching.
    }
    
    // Check cache on mount if loading
    if (fetchLoading) {
      const cached = localStorage.getItem('yt_videos_cache');
      if (cached) {
         setVideos(JSON.parse(cached));
         setLoading(false); // Optimistic load
      }
    }
  }, [fetchedVideos, fetchLoading]);

//   const categories = [
//     "All",  
//     "Gaming", 
//     "Education", 
//     "Technology", 
//     "Travel", 
//     "Vlog", 
//     "News", 
  
//   ];

const categories = useMemo(() => {
  const uniqueCategories = [
    "All",
    ...new Set(videos.map(v => v.category))
  ];
  return uniqueCategories;
}, [videos]);

  const filteredVideos = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return videos.filter((video) => {
      const matchesCategory = activeCategory === "All" || 
                              video.category.toUpperCase() === activeCategory.toUpperCase();
      const matchesQuery = video.title.toLowerCase().includes(lowerSearch);
      return matchesCategory && matchesQuery;
    });
  }, [videos, activeCategory, searchTerm]);

  if (loading && videos.length === 0) {
    return <Loading variant="skeleton" type="video" />;
  }

  return (
    <div className="min-h-screen bg-yt-bg transition-colors duration-300">
      
      {/* Sticky Category Bar */}
      <div className="sticky top-0 z-30 w-full bg-yt-bg/95 backdrop-blur-sm border-b border-yt-border px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-[1400px] mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${activeCategory === cat 
                  ? "bg-yt-text text-yt-bg shadow-md" // Inverse colors for active tab
                  : "bg-yt-surface text-yt-text border border-yt-border hover:bg-yt-border"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] h-auto  relative mx-auto">
        <VideoGrid videos={filteredVideos} />
      </div>
    </div>
  );
};

export default HomePage;