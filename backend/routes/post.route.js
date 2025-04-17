import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { upload } from "../config/multer.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPosts, getCommentsOfPost, getUserPosts, likePost } from "../controllers/post.controller.js";

export const postRouter=express.Router();

postRouter.post('/addpost', isAuthenticated, upload.array('images', 5), addNewPost);


postRouter.get('/all',isAuthenticated,getAllPosts)

postRouter.get('/userpost/all',isAuthenticated,getUserPosts)

postRouter.post('/:id/like',isAuthenticated,likePost)

postRouter.post('/:id/dislike',isAuthenticated,dislikePost)

postRouter.post('/:id/comment',isAuthenticated,addComment)

postRouter.get('/:id/comments/all',isAuthenticated,getCommentsOfPost)

postRouter.delete('/delete/:id',isAuthenticated,deletePost);

postRouter.get('/:id/bookmark',isAuthenticated,bookmarkPost)



