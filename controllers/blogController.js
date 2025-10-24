import Blog from "../models/blog.js";
import multer from "multer";

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error });
    }
}


export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog", error });
    }
}

export const createBlog = async (req, res) => {
    try {
        
        const image = req.files?.image ? req.files.image[0].path : null;
        const markdown = req.files?.markdown ? req.files.markdown[0].path : null;

        const {title, slug, excerpt, tags} = req.body;

        if(!title || !slug || !markdown) {
            return res.status(400).json({ message: "Title, slug, and markdown are required", 
                input: { title, slug, markdown}
            });
        }

        const newBlog = new Blog({ title, slug, excerpt, image, markdown, tags });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: "Error creating blog",
            error,
            input: { title, slug, markdown},
         });
    }
}

export const updateBlog = async (req, res) => {
    try {
        const { title, slug, excerpt, image, markdown, tags } = req.body;
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, slug, excerpt, image, markdown, tags },
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error updating blog", error });
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error });
    } 
}