const validateContent = (req,res,next) => {
    const {title, hasAPage, link, type, slug, excerpt, shortExcerpt, image, markdown, tags} = req.body;
    if(!title || !slug || !type || hasAPage === undefined) {
        return res.status(400).json({
            message: "title, slug, type, and hasAPage fields must be valid.",
            input: {title,slug,type,hasAPage},
        });
    }
    next();
}

export default validateContent;
