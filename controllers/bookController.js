const mongoose = require("mongoose");
const Author = require("../models/Author");
const Book = require("../models/Book");

function isValidObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  return new mongoose.Types.ObjectId(id).toString() === String(id).toLowerCase();
}

async function createBook(req, res) {
  try {
    if (req.body.author !== undefined && !isValidObjectId(req.body.author)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const book = await Book.create({
      title: req.body.title,
      genre: req.body.genre,
      price: req.body.price,
      publishedYear: req.body.publishedYear,
      author: req.body.author,
    });

    res.status(201).json(book);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Could not create the book" });
  }
}

async function getBooks(req, res) {
  try {
    const books = await Book.find().populate("author");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Could not get the books" });
  }
}

async function getBook(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const book = await Book.findById(req.params.id).populate("author");

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Could not get the book" });
  }
}

async function updateBook(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    if (req.body.author !== undefined && !isValidObjectId(req.body.author)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const updates = {};

    if (req.body.title !== undefined) {
      updates.title = req.body.title;
    }

    if (req.body.genre !== undefined) {
      updates.genre = req.body.genre;
    }

    if (req.body.price !== undefined) {
      updates.price = req.body.price;
    }

    if (req.body.publishedYear !== undefined) {
      updates.publishedYear = req.body.publishedYear;
    }

    if (req.body.author !== undefined) {
      updates.author = req.body.author;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Could not update the book" });
  }
}

async function deleteBook(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete the book" });
  }
}

async function getBooksByAuthor(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const books = await Book.find({ author: req.params.id });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Could not get the author's books" });
  }
}

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getBooksByAuthor,
};
