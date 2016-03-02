var DB = require('./db').DB;

var User = DB.Model.extend({
   tableName: 'user',
   idAttribute: 'username',
});

module.exports = {
   User: User
};