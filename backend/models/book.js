const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ""
    },

    coverImage: {
      type: String,
      default: ""
    },

    coverImageUrl: {
      type: String,
      default: ""
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

bookSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Book", bookSchema);