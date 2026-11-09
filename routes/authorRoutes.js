const express = require("express");
const {
  createAuthor,
  getAuthors,
  getAuthor,
  getAuthorStats,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");
const { getBooksByAuthor } = require("../controllers/bookController");

const router = express.Router();

router.post("/", createAuthor);
router.get("/", getAuthors);
router.get("/:id/books", getBooksByAuthor);
router.get("/:id/stats", getAuthorStats);
router.get("/:id", getAuthor);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

module.exports = router;
