import express from 'express';
import {
    createContent,
    updateContent,
    deleteContent,
} from '../controllers/contentController.js';
import validateContent from '../middlewares/validator.js';
import { generateReadToken, invalidateReadToken} from '../controllers/authController.js'
import upload from '../middlewares/upload.js';
import Parse from '../middlewares/Parse.js';
import { authenticateAdminToken } from '../middlewares/authMiddleware.js'

const router = express.Router();

/**
 * @swagger
 * /auth/token/:
 *   get:
 *     summary: Generate a long-lived read token.
 *     tags:
 *       - Authentication required
 *     parameters:
 *       - in: header
 *         name: adminToken
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT admin token 
 *     responses:
 *       200:
 *         description: Generated token
 *       500:
 *         description: Error generating token
 */
router.get('/token', generateReadToken);

/**
 * @swagger
 * /auth/token/:
 *   delete:
 *     summary: Invalidate a read token.
 *     tags:
 *       - Authentication required
 *     parameters:
 *       - in: header
 *         name: adminToken
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT admin token 
 *       - in: header
 *         name: readToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The read token
 *     responses:
 *       200:
 *         description: Successfully invalidated token
 *       500:
 *         description: Error invalidating token
 */
router.delete('/token', invalidateReadToken);

/**
 * @swagger
 * /api/auth/content:
 *   post:
 *     summary: Create a new content item.
 *     tags:
 *       - Content
 *       - Authentication required
 *     parameters:
 *       - in: header
 *         name: adminToken
 *         required: true
 *         schema: 
 *           type: string
 *         description: admin token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 required: true
 *               type: 
 *                 type: string
 *                 required: true
 *               slug: 
 *                 type: string
 *                 required: true
 *               hasAPage:
 *                 type: string
 *                 description: Either "true" or "false".
 *                 required: true
 *               link:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               shortExcerpt:
 *                 type: string
 *               tags:
 *                 type: json
 *                 properties:
 *                   color: 
 *                     type: string
 *                   name: 
 *                     type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               markdown:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Content created
 *       400:
 *         description: Body request missing a required field.
 */
router.post(
    '/content',
    authenticateAdminToken,
    upload.fields([{ name: 'markdown', maxCount: 1 }]),
    Parse,
    validateContent,
    createContent
);

/**
 * @swagger
 * /api/auth/content:
 *   put:
 *     summary: Update an existing content
 *     tags:
 *       - Content
 *       - Authentication required
 *     parameters:
 *       - in: header
 *         name: adminToken 
 *         required: true
 *         schema: 
 *           type: string
 *         description: admin token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               type: 
 *                 type: string
 *               slug: 
 *                 type: string
 *                 required: true
 *               hasAPage:
 *                 type: string 
 *                 description: Either "true" or "false"
 *               link:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               shortExcerpt:
 *                 type: string
 *               tags:
 *                 type: json
 *                 properties:
 *                   color: 
 *                     type: string
 *                   name: 
 *                     type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               markdown:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Content updated.
 *       404:
 *         description: Content with the specified slug does not exist.
 *       500:
 *         description: Error updating content.
 */
router.put(
    '/content',
    authenticateAdminToken,
    upload.fields([{ name: 'markdown', maxCount: 1 }]),
    Parse,
    updateContent
);

/**
 * @swagger
 * /api/auth/content/{slug}:
 *   delete:
 *     summary: Delete a content
 *     tags:
 *       - Content
 *       - Authentication required
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The content slug
 *       - in: header
 *         name: adminToken
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT admin token 
 *     responses:
 *       200:
 *         description: Content deleted
 *       404:
 *         description: Content with the specified slug does not exist.
 *       500:
 *         description: Error deleting content
 */
router.delete('/content', authenticateAdminToken, deleteContent);

export default router;
