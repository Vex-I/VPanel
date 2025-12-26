import Content from "../models/content.js";

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Content
            .find({type: 'blog' })
            .sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error });
    }
}


export const getBlogBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const blog = await Content.findOne({type: 'blog', slug: slug});
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json(blog);

    } catch (error) {
        res.status(500).json({ message: "Error fetching blog", error });
    }
}

export const createBlog = async (req, res) => {
    const {title, slug, excerpt, image} = req.body;
    const markdown = req.markdown;
    const tags = req.tags;
    const type = 'blog';

    try {
        if(!title || !slug || !markdown) {
            return res.status(400).json({ message: "Title, slug, and markdown are required", 
                input: { title, slug, markdown}
            });
        }

        const newBlog = new Content({ title, type, slug, excerpt, image, markdown, tags });

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
    const { title, slug, excerpt, image} = req.body; 
    const markdown = req.markdown;
    const tags = req.tags;
    const type = 'blog';

    try {
        const blog = await Content.findOneAndUpdate(
            req.params.slug,
            { title, type, slug, excerpt, image, markdown, tags },
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
        const blog = await Content.findOneAndDelete(req.params.slug);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found", input: req.params.slug});
        }

        res.status(200).json({ message: "Blog deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error });
    } 
}
