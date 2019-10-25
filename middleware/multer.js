const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'uploads'),
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {fileSize: 4 * 1024 * 1024},
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  }
}).single('avatar')

const checkFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)

  if(mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Images Only!'))
  }
}

module.exports = upload