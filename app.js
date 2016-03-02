//Customers need to register a account number first to record his information and billing information.
//When they want to do a cleanning job, just input how many trucks you want to clean and the clean location you want to go to
// Change the DPFDOC a child to Vehicle. According to the JobID Info or customer info we would find the Job that requires by the customer's accound or Just the jobID he brings with him.
//before and after the cleaning job, RIcaddo will input all Other the information about Job/DPFDOC/BaselineTest/FinalTest...
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var inputSelection= require('./routes/inputSelection');
var mysql = require('mysql');

var gmail = require('./routes/gmail');

//-----------------------------------------------------------------------------------------------------------------------


var login = require('./routes/login');
var Model = require('./routes/model');
var searchJobHistory= require('./routes/searchJobHistory');
var database = require('./routes/database');
var app = express();
var userRequireANewJob  = require('./routes/userRequireANewJob');
var checkExistingContact = require('./routes/checkExistingContact');
var userPage = require('./routes/userPage');//the page for normal user-> not administrator
var UserInputContactAndCompany= require('./routes/UserInputContactAndCompany');
var updateContactInformation = require('./routes/updateContactInformation');


var submitVehicle= require('./routes/admin/submitVehicle');
var passwordChange = require('./routes/passwordChange');







//-----------------------------------------------------------------------------------------------------------------------
//admin
var selectByID = require('./routes/admin/selectByID');
var selectByIDResult= require('./routes/admin/selectByIDResult');
var selectByUsername = require('./routes/admin/selectByUserName');
//var selectByUsernameResult = require('./routes/admin/selectByIDResults')
var selectByNPVD = require('./routes/admin/selectByNPVD');
//add a new Job By operator
var addNewJobAdmin= require('./routes/admin/addNewJobAdmin');

var admin_SearchDPF=require('./routes/admin/admin_SearchDPF');
var submitDPF= require ('./routes/admin/submitDPF');

var chooseExistingContactBasedOnCompanyID = require('./routes/admin/chooseExistingContactBasedOnCompanyID');
var chooseExistingVehicle  = require('./routes/admin/chooseExistingVehicle');
var chooseExistingEngine = require('./routes/admin/chooseExistingEngineBasedOnVIN');

var chooseExistingDPF =require('./routes/admin/chooseExistingDPF');

var addRemainingJobInfo = require('./routes/admin/addRemainingJobInfo');
var addNewCompanyAdmin=require('./routes/admin/addNewCompanyAdmin');


//-----------------------------------------------------------------------------------------------------------------------end admin





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


// create the objects we'll need for doing our improved file routing
var fs = require('fs');
var parse = require('url').parse;
var join = require('path').join;
var root = __dirname + "/public/"; // relative to this script
var connection = mysql.createConnection({
                                        host     : 'localhost',
                                        user     : 'Xig514',
                                        password : 'some_pass',
                                        database : 'Hunsicker'
                                        });

var poolH     =    mysql.createPool({
                                    connectionLimit : 100, //important
                                    host     : 'localhost',
                                    user     : 'Xig514',
                                    password : 'some_pass',
                                    database : 'Hunsicker',
                                    debug    :  false
                                    });



//set up passport
passport.use(new LocalStrategy(function(username, password, done) {
                               new Model.User({username: username}).fetch().then(function(data) {
                                                                                 var user = data;
                                                                                 
                                                                                 if(user === null) {
                                                                                 return done(null, false, {message: 'Invalid username or password'});
                                                                                 } else {
                                                                                 
                                                                                 user = data.toJSON();
                                                                                 //console.log(user.password);
                                                                                 
                                                                                 /*if(!bcrypt.compareSync(password, user.password)) {
                                                                                 console.log('not correct compare');
                                                                                 return done(null, false, {message: 'Invalid username or password'});
                                                                                 } */
                                                                                 if (password.localeCompare(user.password)){
                                                                                 console.log('not correct compare');
                                                                                 return done(null, false, {message: 'Invalid username or password'});
                                                                                 }
                                                                                 else {
                                                                                 return done(null, user);
                                                                                 console.log('correct compare');
                                                                                 }
                                                                                 }
                                                                                 });
                               }));

passport.serializeUser(function(user, done) {
                       done(null, user.username);
                       });

passport.deserializeUser(function(username, done) {
                         new Model.User({username: username}).fetch().then(function(user) {
                                                                           done(null, user);
                                                                           });
                         });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secret strategic xxzzz code', cookie: { maxAge: 360000 }, resave: true, saveUninitialized: true }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static(__dirname + "/public"));
//app.get('/inputSelection', login.showinputSelection);

app.get('/inputSelection',inputSelection.showinputSelection);

/*app.post('/inputSelection',function(req,res)
         {
         login.handle_setSelection(req,res);
         });
*/
app.post('/inputSelection',inputSelection.select);

app.post('/database/:id',function(req,res)
         {
         database.showData(req,res);
         });
app.get('/database/:id',function(req,res)
         {
         database.showData(req,res);
         });
app.get('/insert/:id',function(req,res){
        
        
        });
app.get('/UserInputContactAndCompany/:id',function(req,res){
        UserInputContactAndCompany.UserInputContactAndCompany(req,res);
        });
app.post('/UserInputContactAndCompany/:id',function(req,res){
        UserInputContactAndCompany.UserInputContactAndCompany(req,res);
        });

app.get('/userPage/:id',function(req,res){

        /*
        if(req.params='adminBob')
        {
        inputSelection.showinputSelection;
        }
        else{*/
        //console.log('using userpage!');
        userPage.userPage(req,res);
        //}
        });



app.get('/passwordChange/:id',function(req,res){
    passwordChange.show(req,res);
        });
app.get('/userRequireANewJob/:id', function(req,res){
        userRequireANewJob.NewJob(req,res);
        });
app.post('/userRequireANewJob/:id',function(req,res){
         userRequireANewJob.NewJobPost(req,res);
         
         });
app.get('/login',function(req,res)
        {
        
        login.show(req,res);
        });
app.post('/login',function(req,res)
        {
         console.log('pst login');
        login.signInPost(req,res);
        
        });
app.get('/selectByID',function (req,res){
        selectByID.show(req,res);
        
        });

app.post('/selectByID',function (req,res){
        selectByID.handle_selectByID(req,res);
        
         });
app.get('/selectByUsername',function(req,res){
        selectByUsername.show(req,res);
        });
app.post('/selectByUsername',function(req,res){
         selectByUsername.handle_selectByUsername(req,res);
        });
app.get('/selectByNPVD',function(req,res){
        selectByNPVD.show(req,res);
        });
app.post('/selectByNPVD',function(req,res){
        selectByNPVD.handle_selectByNPVD(req,res);
        });

app.get('/selectByIDResult/:JobID',function (req,res){
        selectByIDResult.show(req,res);
        
        });
app.post('/selectByIDResult/:JobID',function (req,res){
        selectByIDResult.handle_selectByIDResult(req,res);
        
         });
app.get('/checkExistingContact/:id',function(req,res){
        checkExistingContact.showcheckExistingContact(req,res);
        });

app.get('/userJobHistory/:id' ,function (req,res){
        searchJobHistory.showData(req,res);
        
        });
app.get('/admin_SearchDPF',function(req,res){
        admin_SearchDPF.showData(req,res);
   /*     connection.query('SELECT username from user NAME where username like "%'+req.query.key+'%"', function(err, rows, fields) {
                         if (err) throw err;
                         var data=[];
                         for(i=0;i<rows.length;i++)
                         {
                         console.log(data);
                         data.push(rows[i].username);
                         }
                         res.end(JSON.stringify(data));
                         });*/
        });
/*
app.get('/gmail',function(req,res){
        gmail.show(req,res);
        });
 */

//===========================================================================Gmail part
app.get('/addNewJobAdmin',function(req,res){
        addNewJobAdmin.show(req,res);
        });

app.post('/addNewJobAdmin',function(req,res){
         addNewJobAdmin.handle_Selection(req,res);
         });
app.get('/chooseExistingContactBasedOnCompanyID/:id',function (req,res){
        chooseExistingContactBasedOnCompanyID.show(req,res);
        
        });
app.post('/chooseExistingContactBasedOnCompanyID/:id',function (req,res){
         
         chooseExistingContactBasedOnCompanyID.handle_CompanyInput(req,res);
         });


app.get('/chooseExistingVehicle/:id',function(req,res){
    
    chooseExistingVehicle.show(req,res);
    
        });

app.post('/chooseExistingVehicle/:id',function(req,res){
    
    chooseExistingVehicle.handle_Input(req,res);
    
});



app.get('/chooseExistingEngineBasedOnVehicle',function(req,res){
        
        chooseExistingEngine.show(req,res);

        });

app.post('/chooseExistingEngineBasedOnVehicle',function(req,res){
        
        chooseExistingEngine.handle_Input(req,res);
        });

app.get('/chooseExistingDPF',function(req,res){
        
        chooseExistingDPF.show(req,res);
        
        });

app.post('/chooseExistingDPF',function(req,res){
         
         chooseExistingDPF.handle_Input(req,res);
         });

app.get('/addRemainingJobInfo',function(req,res){
         backURL = req.headers['referer'];
         addRemainingJobInfo.show(req,res,backURL);
         });
app.post('/addRemainingJobInfo',function(req,res){
         backURL = req.headers['referer'];
         addRemainingJobInfo.handle_Input1(req,res,backURL);
         });
app.post('/addRemainingJobInfo2',function(req,res){
         
         addRemainingJobInfo.handle_Input2(req,res);
         
         });


app.post('/addNewCompanyAdmin'){
    addNewCompanyAdmin.handle_Input(req,res);
}
/*
app.get('/back',function(req,res,next){
        console.log(req.headers);

        res.redirect(  req.headers['referer']||'/');
       
        });
 */
//================================================================================
app.post('/submitDPF',function(req,res)
         {
         submitDPF.submitDPF(req,res);
         }
         );
app.post('/submitVehicle',function(req,res){
         
         submitVehicle.submitVehicle(req,res);
         });
app.post('/submitOldPassword',function(req,res){
         passwordChange.confirmOld(req,res);
         });
app.post('/submitNewPassword',function(req,res){
    passwordChange.submitNew(req,res);
         });
app.get('/showVehicle',function(req,res){
        var VIN = req.query.key;
        //console.log(VIN);
        var data=[];
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            else{
                            var query1= "Select * From Vehicle Where VIN = "+connection.escape(VIN);
                            connection.query(query1,function(err,rows,fields)
                                             {
                                             if(!err){
                                             if(rows!=null)
                                             {
                                             
                                             
                                             data.push((rows[0].VehicleMake==null)? 'none' :rows[0].VehicleMake);
                                             data.push((rows[0].VehicleModel==null)? 'none...' :rows[0].VehicleModel);
                                             data.push((rows[0].UnitNumber==null)? 'none...' :rows[0].UnitNumber);
                                             data.push((rows[0].VehicleYear==null)? 'Year...' :rows[0].VehicleYear);
                                             data.push((rows[0].VehicleID==null)? '' :rows[0].VehicleID);
                                             //console.log(data);
                                             //console.log(data);
                                             }
                                             else{
                                             data.push('not found');
                                             }
                                             res.json(data);
                                             // res.end(data);
                                             }
                                             else
                                             {
                                             console.log('error in select Vehicle information');
                                             data.push('error in select Vehicle information');
                                             res.json(data);
                                             }
                                             });
                            

                            }
                            connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                            
                            });
        
        });
app.get('/showDPF',function(req,res)
        {
        var DPFID = req.query.key;
        console.log(DPFID)
        var data=[];
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            else{
                            var query1= "Select * From DPFDOC Where DPFID = "+connection.escape(DPFID);
                            connection.query(query1,function(err,rows,fields)
                                             {
                                             if(!err){
                                             if(rows[0]!=null&&rows[0] !=undefined)
                                             {
                                             
                                             data.push(rows[0].TimesCleaned);
                                             data.push((rows[0].PartNumber==null)? 'none' :rows[0].PartNumber);
                                             data.push((rows[0].SerialNumber==null)? 'none...' :rows[0].SerialNumber);
                                             data.push((rows[0].OtherNumber==null)? 'none...' :rows[0].OtherNumber);
                                             data.push(rows[0].Manufacturer);
                                             data.push((rows[0].OuterDiameter==null)? '0' :rows[0].OuterDiameter);
                                             data.push((rows[0].SubstrateDiameter==null)? '0' :rows[0].SubstrateDiameter);
                                             data.push((rows[0].OuterLength==null)? '0' :rows[0].OuterLength);
                                             data.push((rows[0].SubstrateLength==null)? '0' :rows[0].SubstrateLength);
                                             data.push(rows[0].DPForDOC);
                                             data.push(rows[0].TypeOfSubstrate);
                                             //console.log(data);
                                             }
                                             else{
                                             data.push('not found');
                                             }
                                             res.json(data);
                                            // res.end(data);
                                             }
                                             else
                                             {
                                             console.log('error in select DPF information');
                                             data.push('error in selectDPF information');
                                             res.json(data);
                                             }
                                             });
                            
                            
                            }
        
                            connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                            
                            });

        
 
        });
// POST


       

// signup
// GET
app.get('/signup', login.signUp);
// POST
app.post('/signup', login.signUpPost);

// logout
// GET
app.get('/signout', login.signOut);





app.get('/Welcome', function(req, res){
        
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Welcome to Hunsicker Database website. \n');
        });
app.get('/updateContactInformation/:id', function(req,res){
        updateContactInformation.show(req,res);
        });
app.post('/updateContactInformation/:id',function(req,res){
         updateContactInformation.update(req,res);
         });
/********************************/

/********************************/
// 404 not found
app.use(login.notFound404_2);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*
app.get('*',function(req,res){
        
        var url = parse(req.url);
        var path = join(root, url.pathname);
        var stream = fs.createReadStream(path);
        stream.pipe(res);
        stream.on('error', function(err) {
                  do_error(req, res);
                  });
        });
 */
// error handlers
function do_error(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('404: ' + request.url + ' not found\n');
}


// development error handler
// will print stacktrace
/*
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
*/
// production error handler
// no stacktraces leaked to user
/*
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/

var server=app.listen(9000,function()
                      {
                      console.log('Listening Address: ', server.address().port);
                      
                      })

module.exports = app;
