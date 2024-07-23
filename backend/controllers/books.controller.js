const Book = require('../models/Book.model');


exports.createBooks = (req, res, next ) => {
   const newBook = JSON.parse(req.body.book);
   delete newBook._id;
   delete newBook._userId;
   delete newBook._rating; 
   delete newBook._averageRating; 

   const book = new Book({
       ...newBook,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
       rating: [], 
       _averageRating: 0
   });
 
   book.save()
   .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
};

exports.getBooks = (req, res, next) => {
    Book.find()
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(404).json({ error }));
};

exports.editeBooks = (req, res, next ) => {

};