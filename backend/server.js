const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const bookRoutes = require("./routes/bookRoutes");

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
    res.send("Book Store API is running");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });