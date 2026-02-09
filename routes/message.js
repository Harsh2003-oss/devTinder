const express = require('express');
const messageRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
messageRouter.post('/message/send/:userId', userAuth, async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.userId;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message: message.trim(),
    });

    await newMessage.save();

    res.json({
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get conversation with a specific user
messageRouter.get('/messages/:userId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUser, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUser },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'firstName lastName photoUrl')
      .populate('receiverId', 'firstName lastName photoUrl');

    // Mark messages as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: loggedInUser, isRead: false },
      { isRead: true }
    );

    res.json({ data: messages });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all conversations (list of users you've chatted with)
messageRouter.get('/conversations', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedInUser }, { receiverId: loggedInUser }],
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'firstName lastName photoUrl')
      .populate('receiverId', 'firstName lastName photoUrl');

    // Get unique users and their last message
    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.senderId._id.toString() === loggedInUser.toString()
          ? msg.receiverId
          : msg.senderId;
      const otherUserId = otherUser._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      }

      // Count unread messages
      if (
        msg.receiverId._id.toString() === loggedInUser.toString() &&
        !msg.isRead
      ) {
        conversationsMap.get(otherUserId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => b.lastMessageTime - a.lastMessageTime
    );

    res.json({ data: conversations });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = messageRouter;