
import multer from 'multer';
import path from 'path';


// Config for the storage itself
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'content/');
  },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filde filter for only .md and image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.md', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only .md and image files are allowed'), false);
    } 
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;