
var fs = require('fs');
var ejs=require('ejs');


var template = './views/inputSelection.ejs';

var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

// custom library
// model
var Model = require('./model');



exports.select=function(request,response)
{
    switch (request.method) {
        case 'GET':
            show(request,response);
            break;
        case 'POST':
            handle_setSelection(request, response);
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
            if (user.username=='adminBob')
            {
                console.log('its Bob in inputSelection.showinputSelection');
                var h1= 'Please Input Your Selection';
                response.render('inputSelection', {title: 'Input Selection!', h1: h1,user:user});
            }
            else {
                var redirectIndex3='/userPage/'+user.username;
                response.redirect(redirectIndex3);
            }
        }
    };
    
    
    
    /*
    var aa="Please input the table's name you want to search:";
    fs.readFile(template, function(err, data) {
                var url="\'111\'";
                var output = ejs.render(data.toString(), {h1: aa});//,urlLink:url});
                //response.setHeader('Content-type', 'text/html');
                response.end(output);
                });*/
    

function handle_setSelection(request, response) {
    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in inputSelection');
    } else {
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
}

module.exports.showinputSelection=showinputSelection;


