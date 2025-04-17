import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import { useGetAllPost } from '@/hooks/useGetAllPosts'

const Home = () => {
  useGetAllPost();
  return (
    <div className="flex justify-center bg-gray-900 text-white">
      <div className="flex-grow max-w-screen-md">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
