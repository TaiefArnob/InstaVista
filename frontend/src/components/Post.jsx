import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreVertical,
  Smile,
  Trash2,
  UserMinus,
  Star,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CommentDialog from "./CommentDialog";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { deletePost, addComment } from "@/redux/postSlice";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  const [openComments, setOpenComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  useEffect(() => {
    setLiked(post.likes.includes(user._id));
  }, [post.likes, user._id]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/post/${post._id}/like`,
        { userId: user._id },
        { withCredentials: true }
      );
      if (response.data.success) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while liking the post!");
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/post/${post._id}/dislike`,
        { userId: user._id },
        { withCredentials: true }
      );
      if (response.data.success) {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while unliking the post!");
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/post/delete/${post._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(deletePost(post._id));
        toast.success("Post deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post!");
    }
  };

  const handleComment = async () => {
    if (newComment.trim() === "") {
      toast.error("Comment cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/post/${post._id}/comment`,
        { text: newComment },
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(
          addComment({
            postId: post._id,
            comment: response.data.comment,
          })
        );
        setNewComment("");
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment!");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`${API_URL}/post/${post?._id}/bookmark`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md border border-gray-700 shadow-md bg-gray-900 text-white my-6">
      {/* Profile Section */}
      <div className="flex justify-between items-center p-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate(`/profile/${post.author._id}`)}
        >
          <img
            src={post.author.profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3 flex items-center">
            <h3 className="font-semibold text-sm">{post.author.username}</h3>
            {post.author._id === user._id ? (
              <span className="ml-2 text-xs text-gray-500">(Author)</span>
            ) : (
              <UserMinus className="ml-2 w-4 h-4 text-gray-400" title="User" />
            )}
          </div>
        </div>

        {/* Three Dots Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-white">
              <MoreVertical className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-gray-800 text-white rounded-md w-48"
          >
            {post.author._id !== user._id && (
              <DropdownMenuItem
                className="text-red-400 hover:bg-gray-700"
                onClick={() => toast.success("Unfollowed User")}
              >
                <UserMinus className="w-4 h-4 mr-2" /> Unfollow
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="hover:bg-gray-700"
              onClick={() => toast.success("Added to Favourites")}
            >
              <Star className="w-4 h-4 mr-2" /> Add to Favourites
            </DropdownMenuItem>
            {post.author._id === user._id && (
              <DropdownMenuItem
                className="text-red-500 hover:bg-gray-700"
                onClick={handleDeletePost}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Image Slider */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination
        className="w-full h-[400px]"
      >
        {post?.images?.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Post ${index + 1}`}
              className="w-full h-[400px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Icons Section */}
      <div className="flex justify-between items-center p-4">
        <div className="flex space-x-4">
          {liked ? (
            <Heart
              className="w-6 h-6 cursor-pointer text-red-500 fill-red-500"
              onClick={handleUnlike}
            />
          ) : (
            <Heart
              className="w-6 h-6 cursor-pointer hover:text-red-500 transition"
              onClick={handleLike}
            />
          )}
          <MessageCircle
            className="w-6 h-6 cursor-pointer hover:text-blue-400 transition"
            onClick={() => setOpenComments(true)}
          />
          <Send className="w-6 h-6 cursor-pointer hover:text-green-400 transition" />
        </div>
        <Bookmark
          className="w-6 h-6 cursor-pointer hover:text-yellow-400 transition"
          onClick={bookmarkHandler}
        />
      </div>

      {/* Comments Section */}
      <div className="px-4 pb-4">
        <p className="text-sm font-semibold">{likeCount} likes</p>
        <p className="text-sm">
          <span className="font-semibold">{post.author.username}</span>{" "}
          {post.caption}
        </p>

        <p
          className="text-xs text-gray-400 mt-1 cursor-pointer hover:underline"
          onClick={() => setOpenComments(true)}
        >
          View all {post.comments.length} comments
        </p>

        {/* Add a Comment with Emoji Picker */}
        <div className="flex items-center mt-4 relative">
          <div className="relative">
            <Smile
              className="w-6 h-6 text-gray-400 hover:text-yellow-400 cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 z-10">
                <EmojiPicker
                  onEmojiClick={(emojiData) =>
                    setNewComment((prev) => prev + emojiData.emoji)
                  }
                />
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 ml-2 bg-gray-800 text-white rounded-md px-4 py-2 text-sm"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="text-blue-400 font-semibold ml-2"
            onClick={handleComment}
          >
            Post
          </button>
        </div>

        {/* Comment Dialog */}
        <CommentDialog
          open={openComments}
          onOpenChange={setOpenComments}
          post={post}
        />
      </div>
    </div>
  );
};

export default Post;
