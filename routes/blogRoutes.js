import express from 'express';
import {
  getAllBlogs,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Retrieve a list of blogs
 *     responses:
 *       200:
 *         description: A list of blogs
 */
router.get('/blogs', getAllBlogs);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Retrieve a single blog by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog ID
 *     responses:
 *       200:
 *         description: A single blog object
 *       404:
 *         description: Blog not found
 */
router.get('/blogs/:id', getBlogById);

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog
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
 *                 type: string
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
router.post(
  '/blogs',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'markdown', maxCount: 1 }
  ]),
  createBlog
);

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update an existing blog
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
 *                 type: string
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
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'markdown', maxCount: 1 }
  ]),
  updateBlog
);

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog
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
