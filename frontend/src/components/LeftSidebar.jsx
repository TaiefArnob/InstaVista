import { useState, useEffect } from "react";
import { Home, Search, PlusCircle, Heart, User, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import CreatePostDialog from "./CreatePostDialog";
import store from "@/redux/store";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const LeftSidebar = ({ toggleRightSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const {likeNotification}=useSelector(store=>store.realTimeNotification)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const profilePicture = user?.profilePicture || null;

  // Logout Logic
  const handleLogout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.get(`${API_URL}/user/logout`, { withCredentials: true });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        dispatch(setAuthUser(null));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      {isMobile ? (
        // Bottom menu for smaller screens
        <nav
  className="fixed bottom-0 left-0 w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white flex justify-around py-2 z-50"
>
  {[
    { icon: Home, label: "Home", onClick: () => navigate("/") },
    { icon: Search, label: "Search" },
    { icon: PlusCircle, label: "Create", onClick: () => setIsCreatePostOpen(true) },
    { icon: Heart, label: "Notifications", isNotification: true },
    { icon: User, label: "Profile", onClick: () => navigate(`/profile/${user._id}`) },
  ].map(({ icon: Icon, label, onClick, isNotification }, index) => (
    isNotification ? (
      <Popover key={index}>
        <PopoverTrigger asChild>
          <button
            className="relative flex flex-col items-center text-sm text-gray-300 hover:text-white"
          >
            <Icon className="w-6 h-6" />
            {likeNotification.length > 0 && (
              <span className="absolute -top-1 left-4 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {likeNotification.length}
              </span>
            )}
            <span className="mt-1">{label}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-white text-black shadow-xl rounded-lg p-3">
          {likeNotification.length === 0 ? (
            <p className="text-sm text-gray-600">No new notifications</p>
          ) : (
            likeNotification.map((notification, i) => (
              <div key={notification.userId} className="flex items-center space-x-2 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={notification.userDetails?.profilePicture} />
                </Avatar>
                <p className="text-sm">
                  <span className="font-bold">{notification.userDetails?.username}</span> liked your post
                </p>
              </div>
            ))
          )}
        </PopoverContent>
      </Popover>
    ) : (
      <button
        key={index}
        className="flex flex-col items-center text-sm text-gray-300 hover:text-white"
        onClick={onClick}
      >
        <Icon className="w-6 h-6" />
        <span className="mt-1">{label}</span>
      </button>
    )
  ))}
</nav>

      
      ) : (
        // Sidebar for larger screens
        <aside 
  className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl p-4 flex flex-col transition-all duration-300"
>
  {/* InstaVista Logo */}
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-extrabold transition-all duration-300 hover:scale-110 hover:text-blue-400">
      <span className="text-blue-300 hover:text-purple-300 transition-all duration-300">
        Insta
      </span>
      <span className="text-purple-300 hover:text-blue-300 transition-all duration-300">
        Vista
      </span>
    </h1>
  </div>

  {/* Navigation Menu */}
  <nav className="mt-10 flex flex-col items-start space-y-4 justify-center flex-grow">
    {[ 
      { icon: Home, label: "Home", onClick: () => navigate("/") }, 
      { icon: Search, label: "Search" },
      { icon: PlusCircle, label: "Create", onClick: () => setIsCreatePostOpen(true) },
      { icon: MessageSquare, label: "Messages", onClick: () => navigate("/chat") },
    ].map(({ icon: Icon, label, onClick }, index) => (
      <Button
        key={index}
        variant="ghost"
        className="flex items-center gap-4 text-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 p-3 rounded-lg"
        onClick={onClick}
      >
        <Icon className="w-6 h-6" />
        <span>{label}</span>
      </Button>
    ))}

    {/* Notification Popover */}
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex items-center gap-4 text-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 p-3 rounded-lg"
        >
          <Heart className="w-6 h-6" />
          {likeNotification.length > 0 && (
            <span className="absolute left-6 top-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {likeNotification.length}
            </span>
          )}
          <span>Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 bg-white text-black shadow-xl rounded-lg p-3">
        {likeNotification.length === 0 ? (
          <p className="text-sm text-gray-600">No new notifications</p>
        ) : (
          likeNotification.map((notification, i) => (
            <div key={notification.userId} className="flex items-center space-x-2 mb-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={notification.userDetails?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-sm">
                <span className="font-bold">{notification.userDetails?.username}</span> liked your post
              </p>
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>

    {/* Profile and Logout */}
    <Button
      variant="ghost"
      className="flex items-center gap-4 text-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 p-3 rounded-lg"
      onClick={() => navigate(`/profile/${user._id}`)}
    >
      {profilePicture ? (
        <img
          src={profilePicture}
          alt="Profile"
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <User className="w-6 h-6" />
      )}
      <span>Profile</span>
    </Button>

    <Button
      variant="ghost"
      className="flex items-center gap-4 text-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 p-3 rounded-lg"
      onClick={handleLogout}
    >
      <LogOut className="w-6 h-6" />
      <span>Logout</span>
    </Button>
  </nav>

  {/* Footer */}
  <footer className="mt-4 text-gray-500 text-xs text-center">
    <span className="block font-semibold">Created by TaiefArnob</span>
    <span className="block mt-1">All rights reserved</span>
  </footer>
</aside>

      )}

      {isCreatePostOpen && <CreatePostDialog onClose={() => setIsCreatePostOpen(false)} />}
    </>
  );
};

export default LeftSidebar;
