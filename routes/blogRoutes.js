import express from 'express';
import {
    getAllBlogs,
    createBlog,
    getBlogBySlug,
    updateBlog,
    deleteBlog
} from '../controllers/blogController.js';
import upload from '../middlewares/upload.js';
import Parse from '../middlewares/Parse.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Retrieve the list of created blogs.
 *     tags:
 *       - Blog 
 *     responses:
 *       200:
 *         description: The full list of blogs.
 */
router.get('/blogs', getAllBlogs);

/**
 * @swagger
 * /api/blogs/{slug}:
 *   get:
 *     summary: Retrieve a single blog that corresponds to the given slug.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog unique slug identifier.
 *         example: my-first-blog
 *     responses:
 *       200:
 *         description: A single blog object
 *       404:
 *         description: Blog not found
 */
router.get('/blogs/:slug', getBlogBySlug);

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog.
 *     tags:
 *       - Blog
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
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
 *         description: Blog created
 */
router.post('/blogs',
    authenticate,
    upload.fields([{ name: 'markdown', maxCount: 1 }]),
    Parse,
    createBlog );

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update an existing blog
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
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
 *         description: Blog updated
 *       500:
 *         description: Error updating blog
 */
router.put(
    '/blogs/:id',
    authenticate,
    upload.fields([{ name: 'markdown', maxCount: 1 }]),
    Parse,
    updateBlog
);

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog ID
 *     responses:
 *       200:
 *         description: Blog deleted
 *       500:
 *         description: Error deleting blog
 */
router.delete('/blogs/:id', deleteBlog);

export default router;
