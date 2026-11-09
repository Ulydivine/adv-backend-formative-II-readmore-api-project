const mongoose = require("mongoose");
const Author = require("../models/Author");
const Book = require("../models/Book");

function isValidObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  return new mongoose.Types.ObjectId(id).toString() === String(id).toLowerCase();
}

async function createAuthor(req, res) {
  try {
    const author = await Author.create({
      name: req.body.name,
      country: req.body.country,
      bio: req.body.bio,
    });

    res.status(201).json(author);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Could not create the author" });
  }
}

async function getAuthors(req, res) {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: "Could not get the authors" });
  }
}

async function getAuthor(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(author);
  } catch (error) {
    res.status(500).json({ message: "Could not get the author" });
  }
}

async function getAuthorStats(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const books = await Book.find({ author: req.params.id }).sort({
      price: 1,
    });

    const bookCount = books.length;

    const totalPrice = books.reduce((total, book) => {
      return total + book.price;
    }, 0);

    const averagePrice =
      bookCount > 0 ? totalPrice / bookCount : 0;

    const cheapestBook = bookCount > 0 ? books[0].title  : null;

    const mostExpensiveBook =
      bookCount > 0 ? books[bookCount - 1].title  : null;

    res.json({
      author: author.name,
      bookCount,
      averagePrice,
      cheapestBook,
      mostExpensiveBook,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not get author statistics" });
  }
}

async function updateAuthor(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const updates = {};

    if (req.body.name !== undefined) {
      updates.name = req.body.name;
    }

    if (req.body.country !== undefined) {
      updates.country = req.body.country;
    }

    if (req.body.bio !== undefined) {
      updates.bio = req.body.bio;
    }

    const author = await Author.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(author);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Could not update the author" });
  }
}

async function deleteAuthor(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const books = await Book.find({ author: req.params.id });

    if (books.length > 0) {
      return res.status(409).json({
        message: "Cannot delete an author who still has books",
      });
    }

    await Author.findByIdAndDelete(req.params.id);

    res.json({ message: "Author deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete the author" });
  }
}

module.exports = {
  createAuthor,
  getAuthors,
  getAuthor,
  getAuthorStats,
  updateAuthor,
  deleteAuthor,
};
