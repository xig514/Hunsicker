
var fs = require('fs');
var ejs=require('ejs');
var mysql = require('mysql');

var template = './views/login.ejs';
var template2= './views/inputSelection.ejs';
var insert = './views/insert.ejs';
var inputSelection= './routes/inputSelection';
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');


// custom library
// model
var Model = require('./model');

var queryClause="";
var pool     =    mysql.createPool({
                                   connectionLimit : 100, //important
                                   host     : 'localhost',
                                   user     : 'Xig514',
                                   password : 'some_pass',
                                   database : 'Hunsicker',
                                   debug    :  false
                                   });












//index is for the inputSelection page
/*
var index = function (req,res,next)
{
    
    if(!req.isAuthenticated()) {
        console.log('not authed in index');
        res.redirect('/login');
    } else {
        
        var user = req.user;
        
        if(user !== undefined) {
            user = user.toJSON();
        }
        res.render('index', {title: 'Welcome Bob!', user:user});
    }
}
*/
//
//inputSelection Get
var showinputSelection = function(request, response, next) {
    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in inputSelection');
    } else {
        console.log('authed');
        var user = request.user;
        
        if(user !== undefined) {
            user = user.toJSON();
        }
        else {console.log('user = undefined'); }
        if (user.username='adminBob')
        {
        var h1= 'Please Input Your Selection';
        response.render('inputSelection', {title: 'Input Selection!', h1: h1,user:user});
        }
        else {
            var redirectIndex3='/userPage/'+user.username;
            response.redirect(redirectIndex3);
        }
    }
};







exports.login=function(request,response)
{
   
    switch (request.method) {
        case 'GET':
            show(request,response);
            break;
        case 'POST':
            signInPost(request, response);
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
//
var show=function(request,response){
    
    if(request.isAuthenticated())
       {
       var user = request.user;
       if (user ==undefined)
       {
       console.log('authed in show and request.user = undefined');
       }
       else
       {
        
       user = user.toJSON();
           console.log('its define in show name is :'+ user.username);
       if (user.username = 'adminBob')
        response.redirect('/inputSelection');
       else if( user.username!='adminBob')
    {
        var redirectIndex= '/userPage/'+ user.username;
        response.redirect(redirectIndex);
    }
       }
       }
       else{
       
       
    fs.readFile(template, function(err, data) {
               var aa = "Login";
                var title = "Login";
                var again1= "Please input the UserName and Password";
                var output = ejs.render(data.toString(), {h1: aa, title:title ,again:again1});//,urlLink:url});
                //response.setHeader('Content-type', 'text/html');
                response.end(output);
                });
       }
};

/*
var show = function(req, res, next) {
    if(req.isAuthenticated()) res.redirect('/inputSelection');
    var again1= "Please input the UserName and Password";
    res.render('login', {title: 'Log In', h1: 'Log In', again:again1});
};

*/

function handle_login(request, response) {
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
                                        if(!err ) {
                                        if(rows[0]!=null ){
                                        if (rows[0].username=='adminBob')
                                        {
                                        console.log("found");
                                        //inputSelection.select(request,response);
                                        var rdirctIndex= '/inputSelection';
                                        
                                        response.redirect(rdirctIndex);
                                        }
                                        
                                        else if(rows[0].username !='adminBob' ){
                                        
                                        var rdirctIndex= '/userPage/'+UserName;
                                        
                                        response.redirect(rdirctIndex);
                                        
                                        }}
                                        else {//no record found
                                        fs.readFile(template, function(err, data) {
                                                    var aa = "Login";
                                                    var title = "Login";
                                                    var again1= "Incorrect UserName or password";
                                                    var output = ejs.render(data.toString(), {h1: aa, title:title, again:again1});//,urlLink:url});
                                                    response.setHeader('Content-type', 'text/html');
                                                    response.end(output);
                                                    });
                                        }
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
                                        }//end else
                                        });
                       connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                       });

    
   }


//sign in
//post
var  signInPost=function(req, res, next) {
    
    passport.authenticate('local',
                          function(err, user, info) {
    /*passport.authenticate('local', {successRedirect: '/inputSelection',
                          failureRedirect: '/login'}, function(err, user, info) {*/
                          if(err) {
                          console.log('err');
                          return res.render('login', {title: 'Log In', h1:'Log In',errorMessage: err.message,again:err.message});
                          
                          }
                          
                          if(!user) {
                          console.log('!user');
console.log(info.message);
                          return res.render('login', {title: 'Log In', h1:'Log In',errorMessage: info.message,again:info.message});
                          }
                          
                          return req.logIn(user, function(err) {
                                           if(err) {
                                           console.log('err in signInPost');
                                           return res.render('login', {title: 'Log In', h1:'Log in',errorMessage: err.message});
                                           }
                                           else
                                          /* {
                                           return res.redirect('/inputSelection');
                                           }*/
                                           {
                                           
                                           if (user.username=='adminBob')
                                           {
                                           
                                           console.log('its bob');
                                           return res.redirect('/inputSelection');
                                           }
                                           else {
                                           //console.log('111');
                                           var redirectIndex2= '/userPage/'+user.username;
                                           return res.redirect(redirectIndex2);
                                           }
                                           }
                                           
                                           });
                          })(req, res, next);
    
};



// sign up
// GET
var signUp = function(req, res, next) {
    
        res.render('signup', {title: 'Sign Up'});
    
};



// sign up
// POST
var signUpPost = function(req, res, next) {
    var user = req.body;
    var usernamePromise = null;
    usernamePromise = new Model.User({username: user.username}).fetch();
    
    return usernamePromise.then(function(model) {
                                if(model) {
                                res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
                                } else {
                                //****************************************************//
                                // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
                                //****************************************************//
                                var password = user.password;
                                
                                var email = user.email;
                                email= email.toString();
                                //console.log(email);
                                //var hash = bcrypt.hashSync(password);
                                console.log('new username: '+user.username );
                                console.log('new password: '+ password);
                                
                                pool.getConnection(function(err,connection){
                                                   if (err) {
                                                   connection.release();
                                                   
                                                   response.json({"code" : 100, "status" : "Error in connection database"});
                                                   return;
                                                   }
                                                   
                                                   var options = {sql: '...', nestTables: true};
                                                   console.log('connected as id ' + connection.threadId);
                                                   /*if (email=='' || email==undefined)
                                                   { queryClause="INSERT INTO user (username, password) VALUES ("+user.username+","+password+");";
                                                   
                                                   console.log(queryClause);
                                                   }
                                                   else{*/
                                                   var userInput={ username: user.username, email: email,password:password};
                                                   
                                                   // queryClause="INSERT INTO user (username,email, password) VALUES ("+user.username+","+email+","+password+");";
                                                   queryClause = 'INSERT INTO user Set?';
                                                   
                                                    console.log(queryClause);
                                                 //  }
                                                   connection.query(queryClause, userInput, function(err,rows){
                                                                    connection.release();
                                                                    if(!err ) {
                                                                    res.render('signup',{ title:'Sign Up', prompt:'Successfully Registered'});
                                                                    }
                                                                    else{
                                                                    res.render('signup',{ title:'Sign Up', prompt: 'Something Error'});
                                                                    }
                                
                                });
                                                   connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                                                   });
                                

                                
                                }});
}



var handle_setSelection=function(request, response) {
    
    var code=request.body.code;
    console.log(code);
    code=code.toLowerCase();
    if (code.localeCompare("contact")==0)
    {
        var rdirctIndex='/database/0';
        response.redirect(rdirctIndex);
    }
    else if (code.localeCompare("job")==0)
    {
        var rdirctIndex='/database/1';
        response.redirect(rdirctIndex);
    }
    else if (code.localeCompare("vehicle")==0)
    {
        var rdirctIndex='/database/2';
        response.redirect(rdirctIndex);
    }
    else if (code.localeCompare("engine")==0)
    {
        var rdirctIndex='/database/3';
        response.redirect(rdirctIndex);
    }
    else if (code.localeCompare("company")==0)
    {
        var rdirctIndex='/database/4';
        response.redirect(rdirctIndex);
    }
    else if (code.localeCompare("dpfdoc")==0)
    {
        var rdirctIndex='/database/5';
        response.redirect(rdirctIndex);
    }
    else
    {
        output="error";
        response.end('Sorry the code is not right');
    }
}



// sign out
var signOut = function(req, res, next) {
    if(!req.isAuthenticated()) {
        notFound404(req, res, next);
        
    } else {
        req.logout();
        res.redirect('/login');
    }
};

var notFound404 = function(req, res, next) {
    res.status(404);
    res.render('404', {title: 'You\'ve Already Logged Out'});
};
var notFound404_2 = function(req, res, next) {
    res.status(404);
    res.render('404', {title: '404 not found'});
};
//admin get and post
module.exports.handle_setSelection=handle_setSelection;
module.exports.showinputSelection=showinputSelection;
//module.exports.index= index;
//get login
module.exports.show = show;
//post
module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

// 404 not found

module.exports.notFound404 = notFound404;
module.exports.notFound404_2 = notFound404_2;
