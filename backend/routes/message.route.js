import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { getMessage, sendMessage } from '../controllers/message.controller.js';

export const messageRouter=express.Router();


messageRouter.post('/send/:id',isAuthenticated,sendMessage);

messageRouter.get('/all/:id',isAuthenticated,getMessage);