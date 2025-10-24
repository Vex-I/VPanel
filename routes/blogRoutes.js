import express from 'express';
import { getAllBlogs, createBlog, getBlogById, updateBlog, deleteBlog } from '../controllers/blogController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/blogs', getAllBlogs);

router.get('/blogs/:id', getBlogById);

router.post('/blogs', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'markdown', maxCount: 1 }
]), createBlog);

router.put('/blogs/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'markdown', maxCount: 1 }
]), updateBlog);

router.delete('/blogs/:id', deleteBlog);

export default router;