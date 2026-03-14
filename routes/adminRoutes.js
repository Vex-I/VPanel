import express from 'express';
import {
    createContent,
    getAllContent,
    updateContent,
    deleteContent,
    rerenderMarkdown,
} from '../controllers/contentController.js';
import { generateReadToken, invalidateReadToken} from '../controllers/authController.js'
import upload from '../middlewares/upload.js';
import Parse from '../middlewares/Parse.js';
import { 
    authenticateAdminToken,
    verifyAdminAccess,
    verifyManageAccess,
    verifyEditAccess 
} from '../middlewares/authMiddleware.js'

const router = express.Router();

/**
 * @swagger
 * api/auth/token/:
 *   get:
 *     summary: Generate a long-lived read token.
 *     tags:
 *       - Authentication required
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token 
 *     responses:
 *       200:
 *         description: Generated token
 *       500:
 *         description: Error generating token
 */
router.get('/token', authenticateAdminToken, verifyAdminAccess, generateReadToken);

/**
 * @swagger
 * api/auth/token/:
 *   delete:
 *     summary: Invalidate a read token.
 *     tags:
 *       - Authentication required
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token 
 *       - in: body
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
router.delete('/token', authenticateAdminToken, verifyAdminAccess, invalidateReadToken);

/**
 * @swagger
 * /api/auth/content:
 *   get:
 *     summary: Retrieve all contents that matches the parameter, including
 *       unpublished ones
 *     tags:
 *       - Content
 *       - Authentication required
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: false
 *         schema:
 *           type: string
 *         description: The content slug
 *       - in: path
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *         description: The content type
 *       - in: path
 *         name: tags
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: Content item(s) mathcing the specified query.
 *       404:
 *         description: No content specified by the query is found.
 */
router.get('/content', getAllContent);

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
 *         name: method 
 *         required: false 
 *         schema: 
 *           type: string 
 *         description: Rendering method. Leave empty for default. set to
 *           'obsidian' to parse wikilinks
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema: 
 *           type: string
 *         description: The JWT token
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
    verifyManageAccess,
    upload.fields([{ name: 'markdown', maxCount: 1 }]),
    Parse,
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
 *         name: method 
 *         required: false 
 *         schema: 
 *           type: string 
 *         description: Rendering method. Leave empty for default. set to
 *           'obsidian' to parse wikilinks
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema: 
 *           type: string
 *         description: The JWT token
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
    verifyEditAccess,    
    upload.fields([{ name: 'markdown', maxCount: 1 }]),
    Parse,
    updateContent
);

/**
 * @swagger
 * /api/auth/content:
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
 *         name: authorization
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
router.delete('/content', authenticateAdminToken, verifyManageAccess, deleteContent);

/**
 * @swagger
 * /api/auth/content/rerender:
 *   post:
 *     summary: Re-render a markdown of an content entry.
 *     tags:
 *       - Content
 *       - Authentication required
 *     parameters:
 *       - in: header 
 *         name: method 
 *         required: false 
 *         schema: 
 *           type: string 
 *         description: Rendering method. Leave empty for default. set to
 *           'obsidian' to parse wikilinks
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The content slug
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT admin token 
 *     responses:
 *       200:
 *         description: Content rerendered
 *       400:
 *         description: Content does not have any markdown.
 *       404:
 *         description: Content with the specified slug does not exist.
 *       500:
 *         description: Error rerendering content
 */
router.post('/content/rerender', authenticateAdminToken, verifyEditAccess, rerenderMarkdown); 

export default router;
