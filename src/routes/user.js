/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *           example: john_doe
 *         fullName:
 *           type: string
 *           description: The user's full name
 *           example: John Doe
 *         password:
 *           type: string
 *           description: The user's password
 *           example: mySecurePassword
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User created successfully
 *       '400':
 *         description: Bad Request
 *       '409':
 *         description: Username already exists
 *       '500':
 *         description: Internal Server Error
 */
router.post('/signup', userController.signup);


/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login and get JWT tokens
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: mySecurePassword
 *     responses:
 *       '200':
 *         description: Login successful, returns JWT tokens
 *         content:
 *           application/json:
 *             example:
 *               accessToken: eyJhbGciOiJIUzI1NiIsIn...
 *               refreshToken: eyJhbGciOiJIUzI1NiIsIn...
 *               fullName: John Doe
 *       '401':
 *         description: Invalid credentials
 *       '500':
 *         description: Internal Server Error
 */
router.post('/login', userController.login);


/**
 * @swagger
 * /api/user/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsIn...
 *     responses:
 *       '200':
 *         description: Login successful, returns JWT tokens
 *         content:
 *           application/json:
 *             example:
 *               accessToken: eyJhbGciOiJIUzI1NiIsIn...
 *               refreshToken: eyJhbGciOiJIUzI1NiIsIn...
 *       '401':
 *         description: Invalid credentials
 *       '500':
 *         description: Internal Server Error
 */
 
router.post('/refresh-token', userController.refreshToken);

module.exports = router;
