var express = require('express');
var router = express.Router();

// imports the Book model from the ../ models folder
const Book = require('../models').Book; 


// Handler function to wrap each route so that you can use AWAIT inside each route
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (err) {
      next(err);
    }
  }
}

/* GET home page. */
// FIND ALL BOOKS
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

//Render books page
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  //this is finding ALL the books and then passing the "books" as an arguement that holds what it found (which was ALL books)
  res.render('index', { books });
}));

//shows the create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  //TBH I don't know why we put the empty locals object..
  res.render('new-book', { book: {}, title: "New Book" });
}));

//posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    // the request body holds the information in the form as an object
    //sequelize generates an autoincrementing id for each model instance (entry) created
    res.redirect('/books');
  } catch(error){
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new-book', {book, errors: error.errors, title: "New Book"})
    } else {
      throw error;
    }
  }
}));

//shows book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book: book, title: "Update: " + book.title } );
  } else {
    const error = new Error();
    error.status = 404;
    res.render('page-not-found');
    //res.sendStatus(404);
  }
  
}));

//updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book){
      await book.update(req.body);
      res.redirect('/books');
    } else {
      const error = new Error();
      error.status = 404;
      res.render('page-not-found');
      // res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {book, errors: error.errors, title: "Update: " + book.title })  
    } else {
      throw error;
    }
  }
  

}));


//shows book delete form
router.get('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    res.render('delete', { book: book } );
  } else {
    const error = new Error();
    error.status = 404;
    res.render('page-not-found');
    // res.sendStatus(404);
  }
  
}));

//delete book!
router.post("/books/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    await book.destroy();
    res.redirect('/');
  } else {
    // res.sendStatus(404);
    const error = new Error();
    error.status = 404;
    res.render('page-not-found');
  }

}));




module.exports = router;
