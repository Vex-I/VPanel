import express from 'express'; 
import {
    getProfile,
    getUsers,
    editUser,
    deleteUser,
} from '../controllers/userControllers.js';
import Parse from '../middlewares/Parse.js';
import { 
    verifyAdminAccess,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: retrieve the current user profile. 
 *     tags:
 *       - User
 *       - Authentication required
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: the JWT token.
 *     responses:
 *       200:
 *         description: Successfully retreived the current user's profile.
 *       500:
 *         description: Error retrieving the user's profile.
 */
router.get('/profile', getProfile); 

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of all the user.
 *     tags:
 *       - User
 *       - Authentication required
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: the JWT token.
 *     responses:
 *       200:
 *         description: Successfully retreived the user list.
 *       404:
 *         description: No users are registered.
 *       500:
 *         description: Error retrieving user list. 
 */
router.get('/', verifyAdminAccess, getUsers);

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Edit a user's information.
 *     tags:
 *       - User
 *       - Authentication required
 *     parameters:
 *       - in: path 
 *         name: username
 *         required: true 
 *         schema: 
 *           type: string
 *         description: the target user.
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: the JWT token.
 *     requestBody: 
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               newUsername:
 *                 type: string
 *               password:
 *                 type: string 
 *               role: 
 *                 type: string 
 *                 description:
 *                   Should be in JSON format, in an array. Valid roles includes
 *                   "edit", "admin", and "manage".
 *     responses:
 *       200:
 *         description: Successfully edit user.
 *       404:
 *         description: No user with the specified username found.
 *       500:
 *         description: Error editting the user.
 */
router.put('/', verifyAdminAccess, Parse, editUser);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete a specified user.
 *     tags:
 *       - User
 *       - Authentication required
 *     parameters:
 *       - in: path 
 *         name: username
 *         required: true 
 *         schema: 
 *           type: string
 *         description: the target user.
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: the JWT token.
 *     responses:
 *       200:
 *         description: Successfully deleted user.
 *       400:
 *         description: Invalid or no username given.
 *       404:
 *         description: No user with the specified username exist.
 *       500:
 *         description: Error deleting user.
 */
router.delete('/', verifyAdminAccess, deleteUser);

export default router;
