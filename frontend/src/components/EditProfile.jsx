import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { setAuthUser } from "../redux/authSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Initialize useNavigate
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    bio: "",
    profilePicture: "",
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setProfilePictureFile(files[0]);
      setFormData((prev) => ({
        ...prev,
        profilePicture: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append("bio", formData.bio);
      if (profilePictureFile) {
        dataToSend.append("profilePicture", profilePictureFile);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/profile/edit`,
        dataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(res?.data?.message || "Profile updated successfully!");

      dispatch(setAuthUser(res.data.user)); 

      navigate(`/profile/${res.data.user._id}`);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Edit Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium text-white mb-2"
            >
              Profile Picture
            </label>

            <p className="text-sm text-gray-400 mb-4">
              Click the profile picture to change it.
            </p>

            <input
              id="fileInput"
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />

            <div
              onClick={handleImageClick}
              className="cursor-pointer inline-block mb-4"
            >
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Profile Preview"
                  className="mt-2 w-40 h-40 rounded-full object-cover mx-auto border-4 border-gray-300 shadow-md"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  <span>No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-white mb-2"
            >
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
