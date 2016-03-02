var Bookshelf = require('bookshelf');

var config = {
   host: 'localhost',  // your host
   user: 'Xig514', // your database user
   password: 'some_pass', // your database password
   database: 'Hunsicker',
   debug    :  false
};

var DB = Bookshelf.initialize({
   client: 'mysql', 
   connection: config
});

module.exports.DB = DB;