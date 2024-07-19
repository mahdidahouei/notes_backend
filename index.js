
require('dotenv').config();
const express = require('express');
const connectDB = require('./src/db');
const { specs, swaggerUi } = require('./swagger');
const { exec } = require('child_process'); // Import exec
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const userRoutes = require('./src/routes/user');
const noteRoutes = require('./src/routes/note');

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Redirect root to /api-docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Routes
app.use('/api/notes', noteRoutes);
app.use('/api/user', userRoutes);

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Serve Swagger JSON
app.get('/swagger-json', (req, res) => {
  res.json(specs);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);


  const User = require('./src/models/User');

  // User.findOneAndDelete({username: 'shared'}).then(() => {
  //   console.log("User shared deleted");
  // });

  // Call updateNotes script after server starts
  exec('node updateNotes.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});
