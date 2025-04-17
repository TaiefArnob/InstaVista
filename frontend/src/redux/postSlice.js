import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post", // ✅ This must match with `state.post`
  initialState: {
    posts: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
  },
});

export const { setPosts, addPost, deletePost, addComment } = postSlice.actions;
export default postSlice.reducer;
