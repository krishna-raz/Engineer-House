const express = require('express');
const Message = require('../models/Message');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public: Submit a new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const newMessage = new Message({
      name,
      email,
      message
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

// Admin: Get all messages
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
});

// Admin: Toggle read status
router.patch('/:id/read', authMiddleware, adminOnly, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = !message.isRead;
    await message.save();
    res.json({ message: `Message marked as ${message.isRead ? 'read' : 'unread'}`, data: message });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Failed to update message status', error: error.message });
  }
});

// Admin: Delete a message
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message', error: error.message });
  }
});

module.exports = router;
