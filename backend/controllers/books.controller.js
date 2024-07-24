const Book = require('../models/Book.model');

exports.createBooks = (req, res, next) => {
  const newBook = JSON.parse(req.body.book);
  delete newBook._id;
  delete newBook._userId;
  delete newBook._rating;
  delete newBook._averageRating;

  const book = new Book({
    ...newBook,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    ratings: [],
    averageRating: 0
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ error }));
};

exports.getThisBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }
      console.log("Book userId:", book.userId);
      res.status(200).json(book);
    })
    .catch(error => res.status(404).json({ error }));
};

exports.noteThisBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      const existingRating = book.ratings.find(r => r.userId === req.auth.userId);
      if (existingRating) {
        return res.status(400).json({ message: "Vous ne pouvez pas noter deux fois le même livre." });
      }

      const newRating = {
        userId: req.auth.userId,
        grade: req.body.grade
      };

      book.ratings.push(newRating);
      book.averageRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0) / book.ratings.length;

      book.save()
        .then(() => res.status(200).json({ message: "Note enregistrée !" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.editThisBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(thisBook => {
      if (!thisBook) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      if (req.auth.userId !== thisBook.userId) {
        return res.status(401).json({ message: "Vous n'avez pas l'autorisation d'éditer ce livre." });
      }
      const updatedBook = {
        ...req.body,
        _id: req.params.id,
        userId: thisBook.userId  // ensure userId remains the same
      };
      Book.updateOne({ _id: req.params.id }, updatedBook)
        .then(() => res.status(200).json({ message: "Livre mis à jour !" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThisBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(deletingBook => {
      if (!deletingBook) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      if (req.auth.userId !== deletingBook.userId) {
        return res.status(401).json({ message: "Vous ne pouvez ni éditer, ni supprimer ce livre." });
      }
      Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

// Placeholder for bestRatingBooks function
exports.bestRatingBooks = (req, res, next) => {
  // Implementation to be done
};
