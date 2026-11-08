const express = require("express");
const {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");
const { getBooksByAuthor } = require("../controllers/bookController");

const router = express.Router();

router.post("/", createAuthor);
router.get("/", getAuthors);
router.get("/:id/books", getBooksByAuthor);
router.get("/:id", getAuthor);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

module.exports = router;
