var mysql = require('mysql');
var ejs=require('ejs');

var fs = require('fs');

var passport = require('passport');
var template = './views/login.ejs';

var poolH     =    mysql.createPool({
                                   connectionLimit : 100, //important
                                   host     : 'localhost',
                                   user     : 'Xig514',
                                   password : 'some_pass',
                                   database : 'Hunsicker',
                                   debug    :  false
                                   });

exports.show= function(req,res){
    
   if(req.isAuthenticated())
    { if (req.user ==undefined)
    {
        console.log('authed in show and request.user = undefined');
        res.render('errorPage', {usernameE: 'unknown',h1:'Error: Unknown User',errorMessage :'unKnown User',title:'Error: Unknown User'});

    }else{
        var user = req.user;
        user.toJSON();
        //console.log(user.username);
        res.render('passwordChange',{ h1:'Change Password', title:'Change Password',username: req.params.id});
    }
    }
    else
    {
        fs.readFile(template, function(err, data) {
                    var aa = "Login";
                    var title = "Login";
                    var again1= "Session Expired";
                    var output = ejs.render(data.toString(), {h1: aa, title:title ,again:again1});//,urlLink:url});
                    //response.setHeader('Content-type', 'text/html');
                    res.end(output);
                    });
    }


};
exports.submitNew= function(req,res){
    if(req.isAuthenticated()){
    var username = req.query.key;
    var password = req.body.password;
    console.log('password'+password);
    console.log('username'+username);
    var data="";
    var dataToUpdate = {};
    poolH.getConnection(function(err,connection){
                        if(err){
                        console.log('error');
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        else{
                        dataToUpdate.password=password;
                          query1= "Update user  Set ? WHERE username = "+connection.escape(username)+";";
                            connection.query(query1,dataToUpdate,function(err,rows,fields)
                                         {
                                         connection.release();
                                         if(!err){
                                             data='S';
                                             res.json(data);
                                            
                                            
                                         }
                                         else
                                         {
                                         console.log('error in Update user information');
                                         data=('error in Update user password information');
                                         res.json(data);
                                         }
                                         });
                        
                        
                        }
                        
                        connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                        
                        });
    
    }
    else{
        fs.readFile(template, function(err, data) {
                    var aa = "Login";
                    var title = "Login";
                    var again1= "Session Expired";
                    var output = ejs.render(data.toString(), {h1: aa, title:title ,again:again1});//,urlLink:url});
                    //response.setHeader('Content-type', 'text/html');
                    res.end(output);
                    });
    }
};

exports.confirmOld=function(req,res){
    if(req.isAuthenticated()){
    var username = req.query.key;
    var password = req.body.password;
    var data="";
    poolH.getConnection(function(err,connection){
                        if(err){
                        console.log('error');
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        else{
                        
                        var query1= "Select * From user Where username = "+connection.escape(username);
                        connection.query(query1,function(err,rows,fields)
                                         {
                                         connection.release();
                                         if(!err){
                                         if(rows!=null)
                                         {
                                         
                                         if(rows[0].password==password)
                                         {
                                         data='found';
                                         console.log('found');
                                         }
                                         else{
                                         data='not found';
                                         }
                                         //console.log(data);
                                         }
                                         else{
                                         data='invalid username';
                                         
                                         console.log('invalid username');
                                         }
                                         res.json(data);
                                         // res.end(data);
                                         }
                                         else
                                         {
                                         console.log('error in select DPF information');
                                         data=('error in selectDPF information');
                                         res.json(data);
                                         }
                                         });
                        
                        
                        }
                        
                        connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                        
                        });
    }else{
    fs.readFile(template, function(err, data) {
                var aa = "Login";
                var title = "Login";
                var again1= "Session Expired";
                var output = ejs.render(data.toString(), {h1: aa, title:title ,again:again1});//,urlLink:url});
                //response.setHeader('Content-type', 'text/html');
                res.end(output);
                });
    }
}