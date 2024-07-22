const express = require('express');
const router = express.Router(); 

const bookCtrl = require('../controllers/books');

// /api/books => GET + POST(auth)
// --/:id; => GET  + PUT(auth) + DELETE(auth)
// ----rating => POST(auth)
// --/bestrating => GET 

router.get('/', bookCtrl.getBooks); 
// router.post('/', auth); 

// router.get('/:id'); 
// router.put('/:id', auth); 
// router.delete('/:id', auth); 

// router.post('/:id/rating', auth); 

// router.get('/bestrating');

module.exports = router;