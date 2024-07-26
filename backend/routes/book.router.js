const express = require('express');
const router = express.Router(); 

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/books.controller');

router.get('/', bookCtrl.getBooks); 
router.post('/', auth, multer, multer.imgOptimization, bookCtrl.createBooks); 

router.get('/bestrating', bookCtrl.bestRatingBooks);
router.get('/:id', bookCtrl.getThisBook); 
router.put('/:id', auth, multer, multer.imgOptimization, bookCtrl.editThisBook); 
router.delete('/:id', auth, bookCtrl.deleteThisBook); 

router.post('/:id/rating', auth, bookCtrl.noteThisBook); 


module.exports = router;