import {Server} from 'socket.io'
import express from 'express'
import http from 'http';
const app=express();

const server=http.createServer(app);

//Creating socket server
const io=new Server(server,{
    cors:{
        origin:process.env.URL,
        methods:['GET','POST']
    }
})

const userSocketMap={} //This map stores socket id corrsponding the userid->socketId

export const getReceiverSocketId=(receiverId)=>userSocketMap[receiverId]

io.on('connection',(socket)=>{
    const userid=socket.handshake.query.userId;
    if(userid){
        userSocketMap[userid]=socket.id;
        console.log(`User connected: UserId=${userid} SocketId=${socket.id}`); 
    }

    io.emit('getOnlineUsers',Object.keys(userSocketMap))

    socket.on('disconnect',()=>{
        if(userid){
            console.log(`User connected: UserId=${userid} SocketId=${socket.id}`);
            delete userSocketMap[userid] 
        }
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
})

export {app,server,io};
