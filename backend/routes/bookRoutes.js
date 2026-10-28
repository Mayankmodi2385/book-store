const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBookStats
} = require("../controllers/bookController");

const router = express.Router();

// All book routes require authentication
router.use(authMiddleware);

// Dashboard analytics
router.get("/stats", getBookStats);

// Book CRUD
router.post("/", createBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;