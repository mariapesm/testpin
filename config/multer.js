const multer = require('multer');
const path = require('path');
const uuid = require('uuid');

// multer storage
const storage = multer.diskStorage({
  destination: './public/images/uploads/',
  filename: (req, file, cb) => {
    // define what the image name will be (unique UUID + extension)
    cb(null, `pin_${uuid()}${path.extname(file.originalname).toLowerCase()}`);
  }
});

// multer
const upload = multer({
  storage,
  limits: {fileSize: 10000000},
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    // check extension
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // check mime type
    const mimetype = allowedTypes.test(file.mimetype);

    if(mimetype && extname){
      return cb(null, true);
    } else {
      cb('Invalid file type!');
    }
  }
}).single('image');

module.exports = upload;
