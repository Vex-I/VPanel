import multer from 'multer';
import path from 'path';

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.md'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only .md and image files are allowed'), false);
    } 
};

const upload = multer({ storage: multer.memoryStorage(), fileFilter: fileFilter });

export default upload;
