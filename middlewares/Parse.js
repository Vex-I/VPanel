const Parse = (req, res, next) => {
    // Markdown --> String
    const markdownFile = req.files?.markdown?.[0];
    if (markdownFile?.buffer) {
        req.body.markdown = markdownFile.buffer.toString('utf-8');
    } else {
        req.body.markdown = ""; 
    }

    // JSON Input for tags --> Tag object
    let tags = req.body.tags;
    if (tags != null && typeof tags === "string") { 
        try {
            req.body.tags = JSON.parse(tags);
        } catch (err) {
            return res.status(400).json({
                message: 'Invalid tags format. Must be valid JSON.',
                tags: req.body.tags,
                example: [{ name: 'backend', color: 'blue' }]
            });
        }
    } else if (tags == null) {
        req.body.tags = []; 
    }

    // Boolean parsing
    let hasPage = req.body.hasAPage;
    if (hasPage != null) {
        if (typeof hasPage === "boolean") {
            // already valid
        } else if (hasPage === "true" || hasPage === "false") {
            req.body.hasAPage = hasPage === "true";
        } else {
            return res.status(400).json({
                message: 'hasAPage field invalid. Must be either boolean or "true"/"false".',
            });
        }
    } else {
        req.body.hasAPage = false; 
    }

    next();

};

export default Parse;
