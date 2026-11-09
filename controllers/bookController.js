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

    if (isValidObjectId(req.body.author)) {
      const author = await Author.findById(req.body.author);

      if (!author) {
        return res.status(400).json({ message: "Author does not exist" });
      }
    }

    const existingBook = await Book.findOne({
  title: req.body.title,
  author: req.body.author,
}).collation({ locale: "en", strength: 2 });

if (existingBook) {
  return res.status(409).json({
    message: "This author already has a book with this title",
  });
}

const price = req.body.price;
const publishedYear = req.body.publishedYear;
const currentYear = new Date().getFullYear();

if (
  typeof price !== "number" ||
  !Number.isFinite(price) ||
  price <= 0 ||
  !Number.isInteger(publishedYear) ||
  publishedYear < 1450 ||
  publishedYear > currentYear
) {
  return res.status(422).json({
    message: "Price must be greater than 0 and published year must be between 1450 and the current year",
  });
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
    const filters = {};

    if (req.query.genre) {
      filters.genre = req.query.genre;
    }

    if (req.query.author) {
      if (!isValidObjectId(req.query.author)) {
        return res.status(400).json({ message: "Invalid author id" });
      }

      filters.author = req.query.author;
    }

    if (req.query.search) {
      filters.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      filters.price = {};

      if (req.query.minPrice !== undefined) {
        const minPrice = Number(req.query.minPrice);

        if (!Number.isFinite(minPrice)) {
          return res.status(400).json({ message: "Invalid minimum price" });
        }

        filters.price.$gte = minPrice;
      }

      if (req.query.maxPrice !== undefined) {
        const maxPrice = Number(req.query.maxPrice);

        if (!Number.isFinite(maxPrice)) {
          return res.status(400).json({ message: "Invalid maximum price" });
        }

        filters.price.$lte = maxPrice;
      }
    }

    const allowedSortFields = ["price", "title", "publishedYear"];
    const sortOptions = {};

    if (allowedSortFields.includes(req.query.sort)) {
      sortOptions[req.query.sort] = req.query.order === "desc" ? -1 : 1;
    }

    let booksQuery = Book.find(filters).populate("author");

    if (Object.keys(sortOptions).length > 0) {
      booksQuery = booksQuery.sort(sortOptions);
    }

    const books = await booksQuery;

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

    const currentBook = await Book.findById(req.params.id);

if (!currentBook) {
  return res.status(404).json({ message: "Book not found" });
}

    const price = updates.price !== undefined
  ? updates.price
  : currentBook.price;

const publishedYear = updates.publishedYear !== undefined
  ? updates.publishedYear
  : currentBook.publishedYear;

const currentYear = new Date().getFullYear();

if (
  typeof price !== "number" ||
  !Number.isFinite(price) ||
  price <= 0 ||
  !Number.isInteger(publishedYear) ||
  publishedYear < 1450 ||
  publishedYear > currentYear
) {
  return res.status(422).json({
    message: "Price must be greater than 0 and published year must be between 1450 and the current year",
  });
}

const title = updates.title !== undefined ? updates.title : currentBook.title;
const author = updates.author !== undefined ? updates.author : currentBook.author;

const existingBook = await Book.findOne({
  _id: { $ne: req.params.id },
  title: title,
  author: author,
}).collation({ locale: "en", strength: 2 });

if (existingBook) {
  return res.status(409).json({
    message: "This author already has a book with this title",
  });
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
