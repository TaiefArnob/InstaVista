import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  const suggestedUsers = useSelector((state) => state.auth.suggestedUsers); // ✅ Corrected access

  const fetchSuggestedUsers = useCallback(async () => {
    try {
      console.log("Fetching suggested users...");

      const response = await axios.get(`${API_URL}/user/suggested`, { withCredentials: true });

      console.log("API Response:", response.data);

      // ✅ Ensure we process the response correctly
      if (response.data.users && Array.isArray(response.data.users)) {
        console.log("Suggested Users Data:", response.data.users);
        dispatch(setSuggestedUsers(response.data.users));
      } else {
        console.warn("No users found in response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  return { suggestedUsers, fetchSuggestedUsers };
};
