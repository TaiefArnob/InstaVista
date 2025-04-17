import cloudinary from "../config/cloudinary.js";
import { getDataUri } from "../config/dataUri.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({ message: "Enter all fields!", success: false });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(401).json({ message: "User already exists!", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, password: hashedPassword });

    return res.status(201).json({ message: "Account created successfully.", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "Enter all fields!", success: false });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect email or password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const populatedPost = await Post.find({ author: user._id });

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPost,
    };

    return res
      .cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 })
      .json({ message: `Welcome back, ${user.username}`, success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


export const logout = async (req, res) => {
  try {
    await res.cookie('token', '', { maxAge: 0 }).json({ message: 'Logged out successfully', success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).populate({path:'posts',createdAt:-1}).populate({path:'bookmarks'})

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({ message: 'Profile updated successfully.', success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const suggestedUser = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");

    if (!suggestedUsers || suggestedUsers.length === 0) {
      return res.status(400).json({ message: 'Currently do not have any users', success: false });
    }

    return res.status(200).json({ users: suggestedUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const personFollows = req.id;
    const personToBeFollowed = req.params.id;

    if (personFollows === personToBeFollowed) {
      return res.status(400).json({ message: 'You cannot follow/unfollow yourself.', success: false });
    }

    const user = await User.findById(personFollows);
    const targetUser = await User.findById(personToBeFollowed);

    if (!user || !targetUser) {
      return res.status(400).json({ message: 'User not found', success: false });
    }

    const isFollowing = user.following.includes(personToBeFollowed);
    
    if (isFollowing) {
      await Promise.all([
        User.updateOne({ _id: personFollows }, { $pull: { following: personToBeFollowed } }),
        User.updateOne({ _id: personToBeFollowed }, { $pull: { followers: personFollows } })
      ]);
      return res.status(200).json({ message: 'Unfollowed successfully', success: true });
    } else {
      await Promise.all([
        User.updateOne({ _id: personFollows }, { $push: { following: personToBeFollowed } }),
        User.updateOne({ _id: personToBeFollowed }, { $push: { followers: personFollows } })
      ]);
      return res.status(200).json({ message: 'Followed successfully', success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
