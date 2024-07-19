const fs = require('fs');
const mongoose = require('mongoose');
const User = require('./src/models/User'); // Adjust path as necessary

// MongoDB connection
const connectDB = require('./src/db');
connectDB();

async function updateNotes() {
  try {
    // Read JSON files
    const musicData = JSON.parse(fs.readFileSync('music.json', 'utf-8'));
    const techData = JSON.parse(fs.readFileSync('technology.json', 'utf-8'));

    // Combine data from both files
    const allNotes = [...techData, ...musicData];

    // Find the user with username 'shared'
    const user = await User.findOne({ username: 'shared' });
    if (!user) {
      console.log('User with username "shared" not found.');
      return;
    }

    // Extract existing note titles from the database
    const existingNoteTitles = new Set(user.notes.map(note => note.title));

    // Filter out notes with titles that already exist in the database
    const newNotes = allNotes.filter(note => !existingNoteTitles.has(note.title));

    // Add new notes to the user
    if (newNotes.length > 0) {
      user.notes.push(...newNotes);
      await user.save();
      console.log(`Added ${newNotes.length} new notes to the user.`);
    } else {
      console.log('No new notes to add.');
    }
  } catch (error) {
    console.error('Error updating notes:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

updateNotes();
