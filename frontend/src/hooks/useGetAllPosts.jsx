import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetAllPost = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.posts);

    const fetchAllPosts = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/post/all`, { withCredentials: true });

            console.log("Fetched Posts Response:", response.data);

            if (response.data.success) {
                console.log("Posts Data:", response.data.posts); 
                dispatch(setPosts(response.data.posts));
            } else {
                console.warn("API did not return success:", response.data);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchAllPosts();
    }, [fetchAllPosts]);

    return { posts, fetchAllPosts };
};
