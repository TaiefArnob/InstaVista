import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js"; 
import { getReceiverSocketId, io } from "../socket/socket.js";


export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const images = req.files; 
    const authorId = req.id;

    if (!images || images.length === 0) {
      return res.status(400).json({ message: "At least one image is required.", success: false });
    }

    // Optimize and upload images
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const optimizedImageBuffer = await sharp(image.buffer)
          .resize({ width: 800, height: 800, fit: "inside" })
          .toFormat("jpeg", { quality: 80 })
          .toBuffer();

        // Upload to Cloudinary
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(optimizedImageBuffer);
        });
      })
    );

    // Create new post with multiple images
    let newPost = await Post.create({
      caption,
      images: imageUrls,
      author: authorId,
    });

    // Update user's posts array
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(newPost._id);
      await user.save();
    }

    newPost = await newPost.populate({
      path: "author",
      select: "username profilePicture",
    });

    return res.status(201).json({
      message: "Post created successfully.",
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error("Error in addNewPost:", error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};



export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        select: "text author",
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      })
      .sort({ createdAt: -1 });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found", success: false });
    }

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const posts = await Post.find({ author: userId })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        select: "text author",
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      })
      .sort({ createdAt: -1 });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this user", success: false });
    }

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};




export const likePost = async (req, res) => {
  try {
    const person_who_likes = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    // Like logic
    await post.updateOne({ $addToSet: { likes: person_who_likes } });

    //socket io implementation
    const user=await User.findById(person_who_likes).select('username profilePicture')

    const postOwnerId=post.author.toString();
    
    if(postOwnerId!==person_who_likes){
      //emit Notification event
      const notification={
        type:'like',
        userId:person_who_likes,
        userDetails:user,
        postId,
        message:'Your post was liked'
      }

      const postOwnerSocketId=getReceiverSocketId(postOwnerId)

      io.to(postOwnerSocketId).emit('notification',notification)
    }

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.error("Error in likePost:", error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const person_who_likes = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    // Dislike logic
    await post.updateOne({ $pull: { likes: person_who_likes } });

     //socket io implementation
     const user=await User.findById(person_who_likes).select('username profilePicture')

     const postOwnerId=post.author.toString();
     if(postOwnerId!==person_who_likes){
       //emit Notification event
       const notification={
         type:'dislike',
         userId:person_who_likes,
         userDetails:user,
         postId,
         message:'Your post was liked'
       }
 
       const  postOwnerSocketId=getReceiverSocketId(postOwnerId)
 
       io.to(postOwnerSocketId).emit('notification',notification)
     }

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.error("Error in dislikePost:", error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const person_who_comments = req.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required", success: false });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    const comment = await Comment.create({
      text,
      author: person_who_comments,
      post: postId,
    });

    const populatedComment = await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({ message: "Comment added successfully", success: true, comment: populatedComment });
  } catch (error) {
    console.error("Error in addComment:", error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .sort({ createdAt: -1 });

    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this post", success: false });
    }

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error in getCommentsOfPost:", error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    if (post.author.toString() !== authorId) {
      return res.status(403).json({ message: "Unauthorized access!", success: false });
    }

    await Post.findByIdAndDelete(postId);

    let user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({ success: true, message: "Post deleted." });
  } catch (error) {
    console.error("Error in deletePost:", error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (user.bookmarks.includes(post._id)) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== postId);
      await user.save();
      return res.status(200).json({ type: "Unsaved", message: "Post removed from bookmarks", success: true });
    } else {
      user.bookmarks.addToSet(post._id);
      await user.save();
      return res.status(200).json({ type: "Saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.error("Error in bookmarkPost:", error);
    return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
};
