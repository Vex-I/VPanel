import Content from "../models/content.js";

export const getContent = async (req, res) => {
    try {
        const {tags, slug, type } = req.query;

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
    const {title, hasAPage, link, type, slug, excerpt, shortExcerpt, image, markdown, tags} = req.body;
    try {
        const newContent = new Content({ 
            title,
            hasAPage,
            link,
            type,
            slug,
            excerpt,
            shortExcerpt,
            image,
            markdown,
            tags
        });
        await newContent.save();
        res.status(201).json(newContent);
    } catch (error) {
        res.status(500).json({ message: "Error creating project",
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            },
            input: req.body,
         });
    }
}

export const updateContent = async (req, res) => {
    try {
        const updates = {};
        for (const field of Object.keys(Content.schema.paths)) {

            for (const field of Object.keys(Content.schema.paths)) {
            if (req.body[field] !== null) {
                updates[field] = req.body[field];
            }
        }

        const project = await Content.findOneAndUpdate(
            {slug: req.params.slug},
            { $set: updates },
            { new: true, runValidators: true }
        );
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const project = await Content.findOneAndUpdate(
            {slug: req.params.slug},
            { $set: updates },
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
        if(!slug) { return res.status(400).json({message: "No slug specified"})}
        const project = await Content.findOneAndDelete(req.params.slug);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
    } 
}
