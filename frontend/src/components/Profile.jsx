import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { User as UserIcon } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.id;

  // Fetch the user profile data
  useGetUserProfile(userId);

  // Get logged-in user and viewed profile from Redux store
  const { user, userProfile } = useSelector((store) => store.auth);

  console.log("userProfile:", userProfile);
  console.log("loggedInUser:", user);

  const isOwnProfile = user?._id === userProfile?._id;
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Profile Header */}
      <div className="p-4 flex flex-col items-center md:items-start md:flex-row md:justify-between">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          {userProfile?.profilePicture ? (
            <img
              src={userProfile.profilePicture}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
          )}
          {/* Username and Button Section */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h1 className="text-2xl font-bold">
              {userProfile?.username || "Unknown User"}
            </h1>
            <p className="text-sm text-gray-400">
              {userProfile?.bio || "This user has no bio."}
            </p>

            {/* Conditional Buttons */}
            {isOwnProfile ? (
              <div className="flex space-x-2">
                <button 
                  className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg font-medium hover:bg-gray-700 transition-all"
                  onClick={() => navigate("/account/edit")}
                >
                  Edit Profile
                </button>
                <button className="px-4 py-2 border border-gray-700 text-white rounded-lg font-medium hover:bg-gray-700 transition-all">
                  View Archive
                </button>
                <button className="px-4 py-2 border border-gray-700 text-white rounded-lg font-medium hover:bg-gray-700 transition-all">
                  Add Tools
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all border border-gray-300">
                  {userProfile?.isFollowing ? "Unfollow" : "Follow"}
                </button>
                <button className="px-4 py-2 border border-gray-700 text-white rounded-lg font-medium hover:bg-gray-700 transition-all">
                  Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex space-x-6 p-4">
        <div className="text-center">
          <p className="text-lg font-bold">{userProfile?.posts?.length || 0}</p>
          <p className="text-sm text-gray-400">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{userProfile?.followers.length || 0}</p>
          <p className="text-sm text-gray-400">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{userProfile?.following.length || 0}</p>
          <p className="text-sm text-gray-400">Following</p>
        </div>
      </div>

      {/* Posts & Saved Tabs */}
      <div className="flex justify-center space-x-6 p-4 border-b border-gray-700">
        <button 
          className={`text-lg font-bold ${activeTab === "posts" ? "border-b-2 border-white" : "text-gray-400"}`} 
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button 
          className={`text-lg font-bold ${activeTab === "saved" ? "border-b-2 border-white" : "text-gray-400"}`} 
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {activeTab === "posts" ? (
          userProfile?.posts?.length ? (
            <div className="grid grid-cols-3 gap-4">
              {userProfile.posts.map((post, index) => (
                <div
                  key={index}
                  className="relative w-full h-40 bg-gray-800 rounded-md overflow-hidden group"
                >
                  <img
                    src={post.images[0]}
                    alt="Post"
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-4 text-white">
                      <div className="flex items-center space-x-1">
                        <span>❤️</span>
                        <span>{post.likes.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>💬</span>
                        <span>{post.comments.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">No posts yet.</p>
          )
        ) : (
          userProfile?.bookmarks?.length ? (
            <div className="grid grid-cols-3 gap-4">
              {userProfile.bookmarks.map((bookmark, index) => (
                <div
                  key={index}
                  className="relative w-full h-40 bg-gray-800 rounded-md overflow-hidden"
                >
                  <img
                    src={bookmark.images[0]}
                    alt="Bookmark"
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">No bookmarks added.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;
