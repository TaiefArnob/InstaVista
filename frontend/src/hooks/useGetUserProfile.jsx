import { setUserProfile } from '@/redux/authSlice'; 
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/${userId}/profile`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user)); 
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId, dispatch]);
};

export default useGetUserProfile;