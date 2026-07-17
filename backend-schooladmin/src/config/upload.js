import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/ApiError.js';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/licenses';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowed.includes(file.mimetype)) {
    return cb(ApiError.badRequest('Only PDF, JPG, or PNG files are allowed'));
  }
  cb(null, true);
};

export const uploadLicense = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB — matches SchoolRegistration.jsx copy
});
