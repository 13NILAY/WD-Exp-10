// Import required modules
const express = require('express');
const mongoose = require('mongoose');

// Create Express app
const app = express();
const port = 3000;

const MONGO_URL ="mongodb://127.0.0.1:27017/Bookdata";
const dbconnect= async()=>{
    await mongoose.connect(MONGO_URL,{}).then(()=>{
        console.log('connected')
      }).catch((err)=>{
        console.log(err)
      })
}
dbconnect();
// Define Book schema
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    pages: Number
});

// Create Book model
const Book = mongoose.model('Book', bookSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
// GET all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single book
app.get('/books/:id', getBook, (req, res) => {
    res.json(res.book);
});

// Create a new book
app.post('/books', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages
    });
    try {
        const newBook = await book.save();
        console.log(newBook);
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a book
app.patch('/books/:id', getBook, async (req, res) => {
    if (req.body.title != null) {
        res.book.title = req.body.title;
    }
    if (req.body.author != null) {
        res.book.author = req.body.author;
    }
    if (req.body.pages != null) {
        res.book.pages = req.body.pages;
    }
    try {
        const updatedBook = await res.book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a book
app.delete('/books/:id', getBook, async (req, res) => {
    try {
        await res.book.remove();
        res.json({ message: 'Deleted book' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get book by ID
async function getBook(req, res, next) {
    try {
        const book = await Book.findById(req.params.id);
        if (book == null) {
            return res.status(404).json({ message: 'Cannot find book' });
        }
        res.book = book;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
