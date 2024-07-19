/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API endpoints for managing notes
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the note.
 *           example: "My Note"
 *         content:
 *           type: string
 *           description: The content of the note.
 *           example: "This is the content of my note."
 */



const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       '201':
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Note created successfully
 *               note:
 *                 title: My Note
 *                 content: This is the content of my note.
 *                 createdAt: "2022-01-03T12:30:45.000Z"
 *                 updatedAt: "2022-01-03T14:45:22.000Z"
 *       '401':
 *         description: Authentication failed
 *       '500':
 *         description: Internal Server Error
 */
router.post('/', authMiddleware, noteController.createNote);


/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes with lazy loading
 *     tags: [Notes]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: _start
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The starting index of the notes to be fetched
 *       - in: query
 *         name: _limit
 *         schema:
 *           type: integer
 *           default: null
 *         description: The maximum number of notes to be fetched. If not provided, all notes from the specified _start will be fetched.
 *     responses:
 *       '200':
 *         description: Returns an array of notes
 *         content:
 *           application/json:
 *             example:
 *               - title: My Note 1
 *                 content: This is the content of my first note.
 *                 createdAt: "2022-01-03T12:30:45.000Z"
 *                 updatedAt: "2022-01-03T14:45:22.000Z"
 *               - title: My Note 2
 *                 content: This is the content of my second note.
 *                 createdAt: "2022-01-04T12:30:45.000Z"
 *                 updatedAt: "2022-01-04T12:30:45.000Z"
 *       '401':
 *         description: Authentication failed
 *       '500':
 *         description: Internal Server Error
 */
router.get('/', authMiddleware, noteController.getAllNotes);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   get:
 *     summary: Get a single note by ID
 *     tags: [Notes]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the note to retrieve
 *     responses:
 *       '200':
 *         description: Returns the requested note
 *         content:
 *           application/json:
 *             example:
 *               title: My Note
 *               content: This is the content of my note.
 *               createdAt: "2022-01-03T12:30:45.000Z"
 *               updatedAt: "2022-01-03T14:45:22.000Z"
 *       '401':
 *         description: Authentication failed
 *       '404':
 *         description: Note not found
 *       '500':
 *         description: Internal Server Error
 */
router.get('/:noteId', authMiddleware, noteController.getNoteById);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   put:
 *     summary: Update a note by ID
 *     tags: [Notes]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       '200':
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Note updated successfully
 *               note:
 *                 title: Updated Note
 *                 content: This is the updated content of my note.
 *                 createdAt: "2022-01-03T12:30:45.000Z"
 *                 updatedAt: "2022-01-03T14:45:22.000Z"
 *       '401':
 *         description: Authentication failed
 *       '404':
 *         description: Note not found
 *       '500':
 *         description: Internal Server Error
 */
router.put('/:noteId', authMiddleware, noteController.updateNote);

/**
 * @swagger
 * /api/notes/{noteId}:
 *   delete:
 *     summary: Delete a note by ID
 *     tags: [Notes]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the note to delete
 *     responses:
 *       '200':
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Note deleted successfully
 *       '401':
 *         description: Authentication failed
 *       '404':
 *         description: Note not found
 *       '500':
 *         description: Internal Server Error
 */
router.delete('/:noteId', authMiddleware, noteController.deleteNote);

module.exports = router;
