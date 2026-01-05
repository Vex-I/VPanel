import Content from "../models/content.js";

export const getContent = async (req, res) => {
    try {
        const {tags, slug, type, } = req.query;
        if(slug) {
            const content = await Content.find({slug: slug})
            res.status(200).json(content)
        } else {
            const filter = {}
            if(tags) {
                const tagArray = Array.isArray(tags) ? tags : [tags];
                filter['tags.name' ] = { $in: tagArray };
            }
            if (type) filter.type = type;

            const content = await Content.find(filter);
            if (content.length == 0) {
                return res.status(404).json({message:"No content found."})
            } else {
                return res.status(200).json(content);
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Error fetching content", error });
    }
}

export const createContent= async (req, res) => {
    const {title, type, slug, excerpt, image, markdown, tags} = req.body;

    try {
        if(!title || !slug || !markdown) {
            return res.status(400).json({ message: "Title, slug, and markdown are required", 
                input: { title, slug, markdown}
            });
        }
        const newContent = new Content({ title, type, slug, excerpt, image, markdown, tags });
        await newContent.save();
        res.status(201).json(newContent);
    } catch (error) {
        res.status(500).json({ message: "Error creating project",
            error,
            input: { title, slug, markdown},
         });
    }
}

export const updateContent = async (req, res) => {
    const { title, type, slug, excerpt, image, markdown, tags} = req.body;

    try {
        const project = await Content.findOneAndUpdate(
            req.params.slug,
            { title, type, slug, excerpt, image, markdown, tags },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Error updating project", error });
    }
}

export const incrementRead = async (req, res) => {
    try {
        const target = await Content.findOne(req.params.slug);
        if(!target) {
            return res.status(404).json({ message: "Project not found" });
        }
        target.reader = target.reader + 1;
        await target.save();
        res.status(200).json({ message: "Incremented Reader"});
    } catch {
        res.status(500).json({ message: "Error updating project", error });
    }
}

export const deleteContent= async (req, res) => {
    try {
        const project = await Content.findOneAndDelete(req.params.slug);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
    } 
}
