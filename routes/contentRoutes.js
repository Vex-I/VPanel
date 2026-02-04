import express from 'express';
import {
    createContent,
    getContent,
    updateContent,
    deleteContent,
    incrementRead,
} from '../controllers/contentController.js';
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

router.patch('/content/:slug', incrementRead);

export default router;
