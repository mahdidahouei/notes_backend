
require('dotenv').config();
const express = require('express');
const connectDB = require('./src/db');
const { specs, swaggerUi } = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3001;

const userRoutes = require('./src/routes/user');
const noteRoutes = require('./src/routes/note');

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

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
});
