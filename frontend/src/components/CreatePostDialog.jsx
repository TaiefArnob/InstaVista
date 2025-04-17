import React, { useState } from "react";
import { X, ImagePlus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addPost } from "@/redux/postSlice";

const CreatePostDialog = ({ onClose }) => {
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...imagePreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!postText.trim() && images.length === 0) {
      toast.error("Please add at least one image before posting!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("caption", postText);
      images.forEach((img) => formData.append("images", img.file));

      const response = await axios.post(`${API_URL}/post/addpost`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        dispatch(addPost(response.data.post)); // Update Redux store
        toast.success("Post uploaded successfully!");

        setTimeout(() => {
          onClose(); // Close dialog only after the post is added
        }, 300);
      }

      setPostText("");
      setImages([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex justify-center items-center z-50">
      <form
        className="bg-gray-800 text-white rounded-lg p-6 w-96 shadow-lg relative" // Changed background color to gray-800 and text to white
        onSubmit={handlePostSubmit}
      >
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          disabled={loading}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-lg font-bold mb-4 text-center">Create Post</h2>

        {images.length > 0 && (
          <div className="relative mb-3 flex overflow-x-auto space-x-2 scrollbar-hide">
            {images.map((img, index) => (
              <div key={index} className="relative w-24 h-24 flex-shrink-0">
                <img
                  src={img.url}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-black bg-opacity-60 p-1 rounded-full text-white hover:bg-opacity-90"
                  onClick={() => removeImage(index)}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white" // Background color for textarea and text color change
          rows="3"
          placeholder="Write something..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          disabled={loading}
        />

        <label className="flex items-center gap-2 mt-3 text-blue-500 cursor-pointer hover:text-blue-700">
          <ImagePlus className="w-5 h-5" />
          <span>Upload Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
            disabled={loading}
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg w-full flex justify-center items-center gap-2 hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
            </>
          ) : (
            "Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePostDialog;
