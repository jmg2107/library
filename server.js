var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bookController = require('./books/bookController');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//ROUTES

//insert new book
app.post('/api/insertBook', bookController.insertBook);

//get all books
app.get('/api/getAll', bookController.getAll);

//get by author
app.get('/api/getAuth/:id', bookController.getAuth);

//get by title
app.get('/api/getTitle/:id', bookController.getTitle);

//get by content phrase
app.get('/api/getContent/:id', bookController.getContent);

//get by metadata key
app.get('/api/getMetaData/', bookController.getMetaData);

//get by category
app.get('/api/getCategory/:id', bookController.getCategory);

//get by query on published date
//set date with date (MM, DD, YYYY), and set compare with cmp
//EX: /api/getDate/?date=04201859&cmp=eq
app.get('/api/getDate/', bookController.getDate);

//get based on language
app.get('/api/getLanguage/:id', bookController.getLanguage);

//get based on combo
app.get('/api/getCombo/', bookController.getCombo);

//sort by defined keys
app.get('/api/sortByKeys/:id', bookController.sortByKeys);

//limit
app.get('/api/getLimit/', bookController.getLimit);

//pagination
app.get('/api/getPagination/', bookController.getPagination);


// connect to mongo database named "booklist"
mongoose.connect('mongodb://localhost/booklist');

//activate port 8000
app.listen(8000);
console.log('server is now listening on ' + 8000);

module.exports = app;