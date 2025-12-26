
const Parse = (req, res, next) => {
    // Markdown --> String
    if (!req.files?.markdown?.[0]) {
        return res.status(400).json({ message: 'Markdown file is required' });
    }
    const file = req.files.markdown[0];

    req.body.markdown = file.buffer.toString('utf-8');

    //JSON Input for tag ---> Tag object
    let tags = req.body.tags;
    if(tags) {
        try {
            tags = JSON.parse(tags);
            req.body.tags = tags;
        } catch (err) {
            return res.status(400).json({
                message: 'Invalid tags format. Must be valid JSON.',
                example: [
                    { name: 'backend', color: 'blue' }
                ]
            });
        } 
    }

    next();
};

export default Parse;
