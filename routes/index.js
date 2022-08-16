var express = require('express');
var router = express.Router();

// imports the Book model from the ../ models folder
const Book = require('../models').Book; 


// Handler function to wrap each route so that you can use AWAIT inside each route
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

/* GET home page. */
// FIND ALL BOOKS
router.get('/', asyncHandler(async (req, res) => {
  
  //console.log(books);
  res.redirect('/books');
}));

//Render books page
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  //somehow render it to json and then pass the whole thing into the template
  res.render('index', { books });
}));

//shows the create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  //not sure
  res.render('new-book');
}));

//posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  // something
}));

//shows book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  // somethinggg
  res.render('update-book' );
}));

//updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res) => {
  // somethinggg
}));

//delete book!
router.post('/books:id/delete', asyncHandler(async (req, res) => {
  // somethinggg
}));




module.exports = router;
