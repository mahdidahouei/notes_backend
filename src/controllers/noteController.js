// src/controllers/noteController.js
const User = require('../models/User');

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Get the user ID from the token
    const userId = req.user.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new note
    const newNote = { title, content };
    user.notes.push(newNote);
    await user.save();

    res.status(201).json({ message: 'Note created successfully', note: newNote });
  } catch (error) {
    console.error('Create note failed:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.notes);
  } catch (error) {
    console.error('Get all notes failed:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getNoteById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const noteId = req.params.noteId;
    const note = user.notes.id(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note by ID failed:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const noteId = req.params.noteId;
    const note = user.notes.id(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update note properties
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    await user.save();

    res.json({ message: 'Note updated successfully', note });
  } catch (error) {
    console.error('Update note failed:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const noteId = req.params.noteId;
    const note = user.notes.id(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.deleteOne();
    await user.save();

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note failed:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNote, getAllNotes, getNoteById, updateNote, deleteNote };
