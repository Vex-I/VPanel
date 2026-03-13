import { renderMarkdown, wikilinkRender } from '../services/renderMarkdown.js'

//TODO: Split into multipler parser
const Parse = async (req, res, next) => {

    req.body = req.body || {};

    // Markdown file to HTML
    if(req.files?.markdown) {
        const markdownFile = req.files.markdown?.[0];

        if (markdownFile?.buffer) {
            const markdownString = markdownFile.buffer.toString("utf-8");
            if(req.headers["method"] === "obsidian") {
                const parsed = await wikilinkRender(markdownString);    
                req.body.markdown = markdownString;
                req.body.html = parsed;
            } else {
                req.body.html = await renderMarkdown(markdownString);
                req.body.markdown = markdownString;
            }
        } else {
            req.body.markdown = ""; 
            req.body.html = ""; 
        }
    }

    //String tags => Objects
    if(req.body.tags !== undefined) {
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
    }

    if(req.body.role !== undefined) {
        let role = req.body.role;
        if(tags != null && typeof tags === "string") {
            try {
                req.body.role = JSON.parse(role);
            } catch (err) {
                res.status(400).json({
                    message: "Invalid role array. Refer to the API doc",
                    role: req.body.role,
                    example: ["admin","edit","manage"]
                })
            }
        } else {
            req.body.role = [];
        }
    }

    // HasAPage flag 
    if(req.body.hasAPage !== undefined) {
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
    }

    next();

};


export default Parse;
