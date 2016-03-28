
var fs = require('fs');
var ejs=require('ejs');
var mysql = require('mysql');

var template = './views/userPage.ejs';

var queryClause="";
var pool1     =    mysql.createPool({
                                   connectionLimit : 100, //important
                                   host     : 'localhost',
                                   user     : 'root',
                                   password : '',
                                   database : 'Register',
                                   debug    :  false
                                   });
var pool2     =    mysql.createPool({
                                    connectionLimit : 100, //important
                                    host     : 'localhost',
                                    user     : 'root',
                                    password : '',
                                    database : 'Hunsicker',
                                    debug    :  false
                                    });
exports.userPage=function(request,response)
{
    switch (request.method) {
        case 'GET':
            show(request,response);
            break;
        case 'POST':
            handle_userPage(request, response);
            break;
        default:
            bad_request(response);
    }
    
}



function bad_request(request, response) {
        response.statusCode = 400;
        response.setHeader('Content-Type:', 'text/plain');
        response.end('Bad Request');
}

function show(request,response){
    console.log('aa');
    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in userPage');
    }
    else{
        console.log('authed in userPage');
        var user = request.user;
        
        if(user !== undefined) {
            user = user.toJSON();
        }
        else {console.log('user = undefined'); }
        
    var username = request.params.id;
    fs.readFile(template, function(err, data) {
               var aa = "Login";
                var title = "UserPage";
                
                var output = ejs.render(data.toString(), { title:title,usernameE: username});//,urlLink:url});
                //response.setHeader('Content-type', 'text/html');
                response.end(output);
                });
    
}
}

function handle_userPage(request, response) {
    
    var UserName=request.body.userName;
    
    
    console.log(UserName);
    var Password = request.body.password;
    
    
    console.log(Password);
    
    pool.getConnection(function(err,connection){
                       if (err) {
                       connection.release();
                     
                       response.json({"code" : 100, "status" : "Error in connection database"});
                       return;
                       }
                       var options = {sql: '...', nestTables: true};
                       console.log('connected as id ' + connection.threadId);
                       queryClause="Select * From user Where username =  " +connection.escape(UserName) + " And  password = " +connection.escape(Password)+";";
                       console.log(queryClause);
                       connection.query(queryClause,function(err,rows){
                                        connection.release();
                                        if(!err && UserName=='adminBob') {
                                        console.log("found");
                                        var rdirctIndex= '/inputSelection';
                                        response.redirect(rdirctIndex);
                                        
                                        }
                                        else if(!err && UserName !='adminBob' ){
                                        
                                        var rdirctIndex= '/userPage/'+UserName;
                                        
                                        response.redirect(rdirctIndex);
                                        
                                        }
                                        else{
                                         fs.readFile(template, function(err, data) {
                                        var aa = "Login";
                                        var title = "Login";
                                        var again1= "Incorrect UserName or password";
                                        var output = ejs.render(data.toString(), {h1: aa, title:title, again:again1});//,urlLink:url});
                                                    response.setHeader('Content-type', 'text/html');
                                                    response.end(output);
                                                    
                                                    
                                                    });
                                        }
                                        
                                        });
                       connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                       });

    
   }




