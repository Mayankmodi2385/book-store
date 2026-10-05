const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  author: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;