import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Smile, UserMinus } from "lucide-react"; // Import UserMinus for user icon
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../redux/postSlice";

const CommentDialog = ({ open, onOpenChange, post }) => {
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const commentsFromStore = useSelector(
    (state) => state.post.posts.find((p) => p._id === post._id)?.comments || []
  );

  const { user } = useSelector((store) => store.auth); // Access the logged-in user details
  const [comments, setComments] = useState(commentsFromStore);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open]);

  useEffect(() => {
    setComments(commentsFromStore);
  }, [commentsFromStore]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/post/${post._id}/comments/all`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load comments!");
    }
  };

  const handleAddComment = async () => {
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
        setComments((prev) => [...prev, response.data.comment]);
        setNewComment("");
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg p-4 bg-gray-900 text-white rounded-lg shadow-lg">
        {/* ✅ Post Author Info with dynamic "Author" Tag or User Icon */}
        <div className="mb-4 flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post?.author?.profilePicture || "/default-avatar.png"} />
            <AvatarFallback className="text-black bg-white">{post?.author?.username?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-2">
            <Link
              to={`/profile/${post?.author?._id}`}
              className="font-semibold text-sm text-blue-500"
            >
              {post?.author?.username || "Unknown User"}
            </Link>
            {post?.author?._id === user?._id ? (
              <span className="text-xs text-white bg-blue-500 px-2 py-1 rounded-md font-medium">
                Author
              </span>
            ) : (
              <UserMinus className="w-4 h-4 text-gray-400" title="User" />
            )}
          </div>
        </div>

        {/* ✅ Post Image (if available) */}
        {post?.image && (
          <div className="w-full h-64 overflow-hidden rounded-lg mb-4">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ✅ Comments Section */}
        <div className="flex-1 overflow-y-auto max-h-64 bg-gray-800 p-2 rounded-lg">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3 mb-3">
                <Avatar>
                  <AvatarImage src={comment?.author?.profilePicture || "/default-avatar.png"} />
                  <AvatarFallback>{comment?.author?.username?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{comment?.author?.username || "Unknown User"}</p>
                  <p className="text-sm text-gray-300">{comment?.text || ""}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No comments yet.</p>
          )}
        </div>

        {/* ✅ Comment Input */}
        <div className="flex items-center mt-4 relative">
          <div className="relative">
            <Smile
              className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 z-10">
                <EmojiPicker
                  onEmojiClick={(emojiData) => setNewComment((prev) => prev + emojiData.emoji)}
                />
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 ml-2 bg-gray-700 text-white rounded-md px-4 py-2 text-sm"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="text-blue-400 font-semibold ml-2"
            onClick={handleAddComment}
          >
            Post
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;