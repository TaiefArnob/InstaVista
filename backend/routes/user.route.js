import express from 'express'
import { editProfile, followOrUnfollow, getProfile, login, logout, register, suggestedUser } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { upload } from '../config/multer.js';

export const userRouter=express.Router();

userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.get('/logout',logout)
userRouter.get('/:id/profile',isAuthenticated,getProfile)
userRouter.put('/profile/edit',isAuthenticated,upload.single('profilePicture'),editProfile)
userRouter.get('/suggested',isAuthenticated,suggestedUser)
userRouter.post('/followOrunfollow/:id',isAuthenticated,followOrUnfollow)