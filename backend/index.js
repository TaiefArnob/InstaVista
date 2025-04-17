import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import { userRouter } from './routes/user.route.js';
import { postRouter } from './routes/post.route.js';
import { messageRouter } from './routes/message.route.js';
import { app,server } from './socket/socket.js';
import path from 'path'

dotenv.config();


const PORT = process.env.PORT || 6500;
const __dirname=path.resolve();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

//Api 
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)
app.use('/api/message',messageRouter)


app.use(express.static(path.join(__dirname,'/frontend/dist')))
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'frontend','dist','index.html'))
})


connectDb()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed', error);
    });
