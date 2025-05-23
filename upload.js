const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Allowed file types (JPEG, PNG, PDF for resume)
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png/;
  const allowedResumeTypes = /pdf/;

  const extname = path.extname(file.originalname).toLowerCase();

  if (
    (file.fieldname === 'profilePhoto' && allowedImageTypes.test(extname)) ||
    (file.fieldname === 'resume' && allowedResumeTypes.test(extname))
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images for profilePhoto and PDF for resume are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

module.exports = upload;
