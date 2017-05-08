var Book = require('./bookModel');

//helper function that will take an input string
//and output an array with a regex of each word
var helperRegexSplit = function(string){

  var strArray = string.split(' ');
  var regex = [];

  for(var i=0; i<strArray.length; i++){
    var reg = new RegExp(strArray[i], 'i');
    regex.push(reg);
  }

  return regex;
};

module.exports = {


  //insert new book
  insertBook: function(req, res, next){
    console.log('req ', req);
    var book = req.body.book;

    // check to see if book already exists
    Book.findOne({title: book.title}, function (err, books){
      if(err){
        next(error);
      }
      if(books){
          next(new Error('Book already exists!'));
        } else {
          //create the new book
          var newBook = new Book({
            author: {last: book.author.last,
                    first: book.author.first},
            title: book.title,
            content: book.content,
            metadata_tags: book.metadata_tags,
            category: book.category,
            published_date: book.date,
            language: book.language
          });

          newBook.save(function (err){
            if(err){
              next(error);
            } else {
              //book saved in DB
              res.status(201);
            }
          });
      }
    });
  },

  //get all books
  getAll: function(req, res, next){

    //grab all the books
    Book.findOne({}, function (err, books){
      if(err){
        next(error);
      }
      if(!books){
          next(new Error('No books in the library!'));
        } else {
          res.status(200).send(books);
      }
    });

  },

  //get by author
  getAuth: function(req, res, next){

    var author = req.params.id;
    var authReg = helperRegexSplit(author);

    //grab by author
    Book.find({ $or:
      [{'author.last' : { $in : authReg}},
      {'author.first' : { $in: authReg }}]
    } , function (err, books){
      if(err){
        next(err);
      }
      if(!books){
          next(new Error('Author not found'));
        } else {
          res.status(200).send(books);
      }
    });

  },

  //get by title
  getTitle: function(req, res, next){

    var title = req.params.id;
    var titleReg = helperRegexSplit(title);

    //grab by title
    Book.findOne({
      'title': {$in: titleReg}
    }, function (err, books){
      if(err){
        next(err);
      }
      if(!books){
          next(new Error('Title not found'));
        } else {
          res.status(200).send(books);
      }
    });
  },

  //get by content phrase
  getContent: function(req, res, next){

    var content = req.params.id;

    var contentReg = helperRegexSplit(content);

    //grab by title
    Book.findOne({
      'content': {$in: contentReg}
    }, function (err, books){
      if(err){
        next(err);
      }
      if(!books){
          next(new Error('Content not found'));
        } else {
          res.status(200).send(books);
      }
    });
  },

  //get by metadata key
  getMetaData: function(req, res, next){

    console.log('query ', req.query);

    var metaDataTags = req.query;
    var metaArray = [];

    for(var tag in metaDataTags){
      var obj = {}
      obj[tag] = metaDataTags[tag];
      metaArray.push(obj);
    }

    var regex = [];

    for(var i=0; i<metaArray.length; i++){
      var reg = new RegExp(metaArray[i], 'i');
      regex.push(reg);
    }

    //grab by metadata
    Book.findOne({
      'metadata_tags': {$in: regex}
    }, function (err, books){
      if(err){
        next(err);
      }
      if(!books){
          next(new Error('Tags not found'));
        } else {
          res.status(200).send(books);
      }
    });

    //grab by metadata -> find function where it's just a part of it
    // findBook({metadata_tags: metadataTags})
    //   .then(function(books){
    //     if(!books){
    //       next(new Error('Content does not exist'));
    //     } else {
    //       res.status(200).send(books);
    //     }
    //   })
    //   .fail(function (error) {
    //     next(error);
    //   });
  },

  //get by category
  getCategory: function(req, res, next){

    var category = req.params.id;

    var categoryReg = helperRegexSplit(category);

    //grab by category
    Book.findOne({
      'category': {$in: categoryReg}
    }, function (err, books){
      if(err){
        next(err);
      }
      if(!books){
          next(new Error('Content not found'));
        } else {
          res.status(200).send(books);
      }
    });

  },

  //get by params on published date
  getDate: function(req, res, next){
    var month = req.query.date.substr(0,2);
    var day = req.query.date.substr(2,2);
    var year = req.query.date.substr(4, 4);
    var date = new Date(month, day, year);
    var cmp = '$' + req.query.cmp;

    //couldn't get the comparator to work properly
    //it currently only does equals

    Book.findOne({
      'published_date': {$eq: date}
    }, function (err, books){
      if(err){
        next(err);
      }
      if(!books){
          next(new Error('Content not found'));
        } else {
          res.status(200).send(books);
      }
    });

  },

  //get based on language
  getLanguage: function(req, res, next){

    var language = req.params.id;

    var languageReg = helperRegexSplit(language);

    //grab by language
    Book.findOne({
      'language': {$in: languageReg}
    }, function (err, books){
      if(err){
        next(err);
      }
      if(!books){
          next(new Error('Content not found'));
        } else {
          res.status(200).send(books);
      }
    });

  },

  //get based on combo
  getCombo: function(req, res, next){

    //combo will be expecting a JSON object by the name of combo
    //from the query in the URL
    var combo = req.query.combo;

    //get by combo
    Book.find(combo)
    .exec( function (err, books){
      if(err){
        next(err);
      }
      if(!books){
          next(new Error('Content not found'));
        } else {
          res.status(200).send(books);
      }
    });

  },

  //sort by defined keys
  sortByKeys: function(req, res, next){

    var keys = req.params.id;
    var arrKeys = keys.split(' ');
    var sortKeys = [];

    for(var i=0; i<arrKeys.length; i++){
      var sortItem = [];
      sortItem.push(arrKeys[i]);
      sortItem.push(-1);
      sortKeys.push(sortItem);
    }

    //return list sorted by keys
    Book.find()
    .sort(sortKeys)
    .exec( function (err, books){
      if(err){
        next(err);
      }
      if(!books){
          next(new Error('Content not found'));
        } else {
          res.status(200).send(books);
      }
    });

  },

  //limit

  getLimit: function(req, res, next){
    //returns number of books in library
    Book.count({})
    .exec( function (err, books){
      if(err){
        next(err);
      }
      if(!books){
          next(new Error('Content not found'));
        } else {
          console.log('count is ', books);
          res.sendStatus(200).send(books);
      }
    });

  },

  //pagination - incomplete
  getPagination: function(req, res, next){

    //not quite certain what's needed for this
  }


}