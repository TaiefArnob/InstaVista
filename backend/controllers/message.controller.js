import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message content is required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // If conversation does not exist, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: []
            });
        }

        // Create new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        // Push the message into the conversation
        conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        // Implement socket.io for real-time messaging here
        const receiverSocketId=getReceiverSocketId(receiverId)

        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage)
        }

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            newMessage
        });

    } catch (error) {
        console.error("Error in sendMessage:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get messages between two users
export const getMessage = async (req, res) => {
    try {
      const senderId = req.id;
      const receiverId = req.params.id;
  
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      }).populate({
        path: "messages",
        populate: {
          path: "senderId receiverId",
          select: "name email profilePicture createdAt",
        },
      });
  
      if (!conversation) {
        return res.status(200).json({
          success: true,
          messages: [],
        });
      }
  
      return res.status(200).json({
        success: true,
        messages: conversation.messages,
      });
    } catch (error) {
      console.error("Error in getMessage:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
