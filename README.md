# library
API to a library of books hosted on MongoDB

#approach
-run NPM install from root
-use mongoDB to hold all data
-run 'mongod' to start database
-run 'node server.js' from root to start
-server will be hosted on localhost:8000
-test with Postman

-see all API routes in server.js
-begin by loading book json data with /insertBook route
-one book is provided in data.json


#scaling considerations
-if this were deployed as a service, we should consider the size of the DB
-as is, we only are able to load 1 new book at a time -> this could be turned
into an array load
-as API routes are added, queries can more complicated and can slow down. We may need to either rethink the model or expediting the queries themselves
-currently, the content has a string datatype, this should be changed to hold something bigger if the entire book will be hosted on the db
-if there are many searches per second, there may need to be multiple clusters of the db as to not bog down one db -> consider sharding

