let async = require('async');
let Book = require('../models/book');
let BookInstance = require('../models/bookinstance');

// Function to get book details by ID
function get_book(id) {
    // Ensure id is a valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return null; // Return null if id is not a valid ObjectId
    }
    return Book.findOne({'_id': id}).populate('author');
}

// Function to get book instance details by book ID
function get_book_dtl(id) {
    // Ensure id is a valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return null; // Return null if id is not a valid ObjectId
    }
    return BookInstance.find({ 'book': id }).select('imprint status');
}

// Controller function to show book details
exports.show_book_dtls = async (req, res) => {
    const id = req.params.id; // Assuming id is passed in URL parameters
    try {
        // Fetch book details and book instance details concurrently using Promise.all
        const [book, copies] = await Promise.all([
            get_book(id),
            get_book_dtl(id)
        ]);
        
        // Check if book exists
        if (!book) {
            return res.status(404).send(`Book ${id} not found`);
        }

        // Send response with book details
        res.send({
            title: book.title,
            author: book.author.name,
            copies: copies
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
