import express from 'express';
import {
    createContent,
    getContent,
    updateContent,
    deleteContent,
    incrementRead,
} from '../controllers/contentController.js';

import upload from '../middlewares/upload.js';
import Parse from '../middlewares/Parse.js';
import { authenticateAdminToken } from '../middlewares/authMiddleware.js'

const router = express.Router();

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Retrieve contents that matches the parameter
 *     tags:
 *       - Content
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
router.get('/content', getContent);

/**
 * @swagger
 * /api/content:
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
 *               type: 
 *                 type: string
 *               slug: 
 *                 type: string
 *               hasAPage:
 *                 type: boolean
 *               link:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               shortExcerpt:
 *                 type: string
 *               tags:
 *                 type: object
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
 *         description: Body request missing either a title, slug, or markdown.
 */
router.post(
    '/content',
    authenticateAdminToken,
    upload.fields([{ name: 'markdown', maxCount: 1 }]),
    Parse,
    createContent
);

/**
 * @swagger
 * /api/content:
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
 *               hasAPage:
 *                 type: boolean
 *               link:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               shortExcerpt:
 *                 type: string
 *               tags:
 *                 type: object
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
    '/content/:slug',
    authenticateAdminToken,
    upload.fields([{ name: 'markdown', maxCount: 1 }]),
    Parse,
    updateContent
);

/**
 * @swagger
 * /api/content/{slug}:
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
router.delete('/content/:slug', authenticateAdminToken, deleteContent);

router.patch('/content/:slug', incrementRead);

export default router;
