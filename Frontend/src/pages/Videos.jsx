import React from 'react';
import VideoPage from '../components/VideoPage';
import VideoSideBar from '../components/VideoSideBar';

const Videos = () => {
  return (
    <div className="w-full  min-h-screen bg-yt-bg transition-colors duration-300">
      {/* Main Container - max width for ultra-wide screens */}
      <div className="max-w-[1700px]mx-auto flex flex-col lg:flex-row gap-4 px-0 sm:px-4 py-4">
        
        {/* Main Content Area: Video and Comments */}
        <div className="w-full lg:w-[70%]">
          <VideoPage />
        </div>

        {/* Sidebar: Recommendations - Hidden on screens < lg */}
        <div className="hidden lg:block lg:w-[30%]">
          <VideoSideBar />
        </div>
      </div>
    </div>
  );
};

export default Videos;