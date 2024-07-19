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
    newNote.createdAt = newNote.updatedAt = Date.now();
    user.notes.push(newNote);
    var newUser = await user.save();

    const responseNote = newUser.notes[newUser.notes.length - 1];

    res.status(201).json({ message: 'Note created successfully', note: responseNote });
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

    // Get _start and _limit from query parameters, set defaults if not provided
    const start = parseInt(req.query._start, 10) || 0;
    const limit = parseInt(req.query._limit, 10);

    // Get the notes based on the _start and _limit parameters
    let notes;
    if (limit) {
      notes = user.notes.slice(start, start + limit);
    } else {
      notes = user.notes.slice(start);
    }

    // Truncate content to approximately 80 characters
    const truncateContent = (content) => {
      return content.length > 80 ? content.substring(0, 85).trim() + '…' : content;
    };

    const truncatedNotes = notes.map(note => ({
      ...note._doc,
      content: truncateContent(note.content)
    }));

    res.json(truncatedNotes);
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
    note.updatedAt = Date.now()
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
