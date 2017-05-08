var mongoose = require('mongoose');

var BookSchema = mongoose.Schema({

  author: {last: String,
          first: String},
  title: String,
  content: String,
  metadata_tags: {},
  category: [],
  published_date: Date,
  language: []

});

module.exports = mongoose.model('books', BookSchema);