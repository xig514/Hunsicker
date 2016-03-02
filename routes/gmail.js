
var fs = require('fs');
var ejs=require('ejs');
var mysql = require('mysql');

var template = './views/userPage.ejs';



exports.show=function(req,res)
{
    res.render('gmailTest',{h1:"gmailTest"});
}



