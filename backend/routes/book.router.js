const express = require('express');
const router = express.Router(); 

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/books.controller');

// /api/books => GET + POST(auth)
// --/:id; => GET  + PUT(auth) + DELETE(auth)
// ----rating => POST(auth)
// --/bestrating => GET 

router.get('/', bookCtrl.getBooks); 
router.post('/', auth, multer, bookCtrl.createBooks); 

// router.get('/:id'); 
// router.put('/:id', auth, multer); 
// router.delete('/:id', auth); 

// router.post('/:id/rating', auth, multer); 

// router.get('/bestrating');

module.exports = router;