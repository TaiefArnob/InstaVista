import React from "react";
import { UserCircle, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetSuggestedUsers } from "@/hooks/useGetSuggestedUsers"; // ✅ Import custom hook

const RightSidebar = ({ isMobileOpen, closeSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const { suggestedUsers } = useGetSuggestedUsers(); // ✅ Fetch suggested users

  return (
    <div
      className={`${
        isMobileOpen ? "block" : "hidden lg:block"
      } fixed top-0 right-0 w-80 bg-gray-900 text-white shadow-md rounded-lg h-full z-50`}
    >
      {/* Close Button for Mobile */}
      <div className="flex justify-between items-center p-4 lg:hidden">
        <h2 className="text-lg font-semibold">Profile</h2>
        <button onClick={closeSidebar}>
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <UserCircle className="w-12 h-12 text-gray-400" />
          )}
          <div className="ml-3">
            <h3 className="font-semibold">{user?.username || "Username"}</h3>
            <p className="text-sm text-gray-400">{user?.bio || "No bio available"}</p>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          Edit Profile
        </button>
      </div>

      {/* Suggestions Section */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-400">Suggested for You</h4>
        {suggestedUsers && suggestedUsers.length > 0 ? (
          suggestedUsers.map((suggested) => (
            <div
              key={suggested.id}
              className="flex justify-between items-center mt-4 p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <div className="flex items-center">
                {suggested.profilePicture ? (
                  <img
                    src={suggested.profilePicture}
                    alt={suggested.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-10 h-10 text-gray-400" />
                )}
                <div className="ml-3">
                  <h3 className="text-sm font-semibold">{suggested.username}</h3>
                  <p className="text-xs text-gray-400">Suggested for you</p>
                </div>
              </div>
              <button className="text-blue-500 text-sm font-semibold hover:text-blue-600 transition">
                Follow
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 mt-2">No suggested users available.</p>
        )}
      </div>

      {/* Footer Links */}
      <div className="p-4 text-xs text-gray-500 text-center border-t border-gray-700">
        <p>About · Help · Press · API · Jobs · Privacy · Terms</p>
        <p className="mt-2">© {new Date().getFullYear()} InstaVista</p>
      </div>
    </div>
  );
};

export default RightSidebar;
