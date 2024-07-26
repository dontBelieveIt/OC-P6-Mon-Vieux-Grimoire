const multer = require('multer');
const sharp = require('sharp'); 
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

function fileFilter(req, file, cb) {
  cb(MIME_TYPES, true)
  cb(new Error("Le fichier doit-être une image ! (jpg, jpeg, png)."))
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + Math.round(Math.random() *1E9) + extension);
  }
});

module.exports = multer({storage: storage}).single('image');

module.exports.imgOptimization = (req, res, next) => {
  if (req.file) { // check if request has a downloaded file
    const filePath = req.file.path;
    const output = path.join('images', `optimized_${req.file.filename}`); // where picture will be sent, and name
    sharp.cache(false);
    sharp(filePath)         
        .resize({width: 412, height: 520,  fit: 'cover' }) // Resize picture
        .webp({ quality: 85 })
        .toFile(output) // Upload new picture 
        .then(() => {
            req.file.path = output;
            console.log("Optimisation effectuée !")
            next();
            })
        .catch(err => next(err))
} else {
    return next();
}};