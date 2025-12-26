import express from 'express';
import {
    getAllContent,
    createContent,
    getContentBySlug,
    updateContent,
    deleteContent
} from '../controllers/contentController.js';

import upload from '../middlewares/upload.js';
import Parse from '../middlewares/Parse.js';
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router();

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Retrieve a list of content 
 *     tags: 
 *       - Content
 *     parameters:
 *       -in: path
 *       name: type
 *       required: false
 *       schema:
 *         type: string
 *       description: The content type.
 *     responses:
 *       200:
 *         description: A list of all content of a type.
 */
router.get('/content', getAllContent);

/**
 * @swagger
 * /api/content/{slug}:
 *   get:
 *     summary: Retrieve a single content by it's slug 
 *     tags:
 *       - Content
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The content slug
 *     responses:
 *       200:
 *         description: A single content item.
 *       404:
 *         description: A content entry with the slug does not exists.
 */
router.get('/content/:slug', getContentBySlug);

/**
 * @swagger
 * /api/content:
 *   post:
 *     summary: Create a new content item.
 *     tags:
 *       - content
 *       - Authentication required
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
 *                   color: string
 *                   name: string
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
 *         description: Invalid body.
 */
router.post(
    '/content',
    authenticate,
    upload.fields([{ name: 'markdown', maxCount: 1 }]),
    Parse,
    createContent
);

/**
 * @swagger
 * /api/content/{slug}:
 *   put:
 *     summary: Update an existing content
 *     tags:
 *       - Content
 *       - Authentication required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The content slug
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
 *                   color: string
 *                   name: string
 *               image:
 *                 type: string
 *                 format: binary
 *               markdown:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Content updated
 *       404:
 *         description: Content with the specified slug does not exist.
 *       500:
 *         description: Error updating content
 */
router.put(
    '/content/:slug',
    authenticate,
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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The content slug
 *     responses:
 *       200:
 *         description: Content deleted
 *       404:
 *         description: Content with the specified slug does not exist.
 *       500:
 *         description: Error deleting content
 */
router.delete('/content/:slug', authenticate, deleteContent);

export default router;
