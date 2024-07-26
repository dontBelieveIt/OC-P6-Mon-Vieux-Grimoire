const Book = require('../models/Book.model');
const fs = require('fs-extra'); 

exports.createBooks = (req, res, next) => {
  const newBook = JSON.parse(req.body.book);
  delete newBook._id;
  delete newBook._userId;
  // delete newBook._ratings;
  // delete newBook._averageRating;

  const book = new Book({
    ...newBook,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    // ratings: [],
    // averageRating: 0
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

      // Extract the image URL and get the path to the file
      const filename = deletingBook.imageUrl.split('/images/')[1];
      const filePath = `./images/${filename}`;

      // Delete the book from the database and the image file
      return Book.deleteOne({ _id: req.params.id })
        .then(() => fs.remove(filePath))
        .then(() => res.status(200).json({ message: 'Livre et fichier image supprimés !' }))
        .catch(error => res.status(500).json({ message: 'Erreur lors de la suppression.', error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.noteThisBook = async (req, res, next) => {
  try {
    console.log("Request to rate book:", req.params.id);

    const book = await Book.findById(req.params.id);
    if (!book) {
      console.log("Book not found");
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    console.log("Found book:", book);
    console.log("Requesting user ID:", req.auth.userId);

    // Check if the user has already rated this book
    const existingRating = book.ratings.includes(r => r.userId === req.auth.userId);
    if (existingRating) {
      console.log("User has already rated this book");
      return res.status(400).json({ message: "Vous ne pouvez pas noter deux fois le même livre." });
    }

    // Ensure that req.body.grade is defined and valid
    const { rating } = req.body;
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      console.log("Invalid rating:", rating);
      return res.status(400).json({ message: "La note doit être un nombre entre 1 et 5." });
    }

    console.log("Adding new rating:", rating);
    const newRating = {
      userId: req.auth.userId,
      grade: rating
    };

    book.ratings.push(newRating);

    const totalGrades = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = (totalGrades / book.ratings.length).toFixed(1);

    const updatedBook = await book.save();
    console.log("Updated book:", updatedBook);
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error });
  }
};


// Placeholder for bestRatingBooks function
exports.bestRatingBooks = (req, res, next) => {
  Book.find()
  .then(bestBooks => {

    const sortBooks = bestBooks.sort(function(a, b) {
      return b.averageRating - a.averageRating;
    });
    const threeBest = sortBooks.slice(0, 3);

    res.status(200).json(threeBest)
  })
  .catch(error => res.status(404).json({ error }));
};
