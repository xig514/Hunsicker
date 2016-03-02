
var fs = require('fs');
var ejs=require('ejs');
var mysql = require('mysql');

var template = './views/UserInputContactAndCompany.ejs';
//var usename="";
var queryClause="";

var poolH     =    mysql.createPool({
                                   connectionLimit : 100, //important
                                   host     : 'localhost',
                                   user     : 'Xig514',
                                   password : 'some_pass',
                                   database : 'Hunsicker',
                                   debug    :  false
                                   });

var FirstName ="";
var LastName = "";
var PhoneNumber ="";
var EmailAddress = "";
var SiteAddress = "";
var SiteCity = "";
var SiteState ="";
var SiteZip = "";
var ContactStatusID ="";
var MaxContactID = 0;
var MaxCompanyID = 0;
var title = "Input into Company and Contact";

exports.UserInputContactAndCompany=function(request,response)
{
    switch (request.method) {
        case 'GET':
            show(request,response);
            break;
        case 'POST':
            handle_input(request, response);
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
function show(request, response){
    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in UICC');
    } else
    
    fs.readFile(template, function(err, data) {
               var aa = "Login";
                var title = "Input into Company and Contact";
                var username = request.params.id;
                var output = ejs.render(data.toString(), {title:title,usernameE :username});//,urlLink:url});
                //response.setHeader('Content-type', 'text/html');
                response.end(output);
                });
    


}

function handle_Contact(request,response){//an old Company
    var ContactStatusID_INT=1;
    if(ContactStatusID=='Yes')
    {
         ContactStatusID_INT =1;
        //console.log('checked');
    }
    else
    {
        ContactStatusID_INT = 0;
    }
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        
                        response.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }

    var queryClause2 ="Select ContactID As solution From Contact  Where FirstName  = " +connection.escape(FirstName) + " And  LastName = " +connection.escape(LastName)+"And PhoneNumber="+ connection.escape(PhoneNumber)+"And SiteAddress="+ connection.escape(SiteAddress)+";";
    console.log(queryClause2);
    //-------------------------------------------------------------------------
    connection.query(queryClause2,function(err,rows){
                     
                     if(!err)
                     {
                     
                     if(rows[0]!=null && rows[0].solution!=undefined)//we found the Contact also in the database
                     {
                     console.log('The ContactID is :' +rows[0].solution);
                     //than we check the Link between ContactID and User, is exists return already in the database
                     MaxContactID=rows[0].solution;
                     var username = request.params.id;
                     var queryClause3="Select username as username1, ContactID  As ContactID1 From user_Contact Where username  = " +connection.escape(username) + " And  ContactID = " +connection.escape(MaxContactID)+";";
                     connection.query(queryClause3,function(err,rows){
                                      if(!err){
                                      if(rows[0]!=null)
                                      {
                                      console.log('the user_Contact is '+ rows[0].ContactID1+rows[0].username1);
                                      response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'System has already got this Contact.'});
                                      }
                                      else{//no such link record found
                                      var insertuc= "Insert Into user_Contact Set ?";
                                      var user_ContactInput={username:username, ContactID:MaxContactID};
                                      
                                      //-----------------------------------------------------------------------------------
                                      connection.query(insertuc,user_ContactInput,function(err,rows){
                                                       
                                                       if(!err ) {
                                                       //we sucessfully input the data into user_Contact
                                                       
                                                       
                                                       response.redirect('/userpage/'+username);
                                                       response.render('userPage',{ title:title ,usernameE: request.params.id, errorMessage:'Successful'});
                                                       }
                                                       else{
                                                       
                                                       response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to insert into user_Contact1'});
                                                       }
                                                       });
                                      //-------------------------------------------------------------------------------------------------------------------------------
                                      }
                                      }
                                    else{ response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to find link between user and Contact'});}
                                      
                                      });
                     //----------------------------------------------------------------------------
                     }
                     else {
                     //it's a new Contact, let's input it into the Contact
                     var findLargestContactID = "Select Max(ContactID) AS solution from Contact;";
                     //-----------------------------------------------------------------------------------------------
                     //find max ContactID
                     connection.query(findLargestContactID,function(err,rows){
                                      if (!err)
                                      {
                                      if(rows[0]!=null &&rows[0].solution!=undefined)
                                      {
                                      
                                      MaxContactID= rows[0].solution+1;
                                      console.log('Now the max CTID is :'+MaxContactID);
                                      //--------------------------------------------------------------------------------------------------------------
                                      var insertContact="INSERT INTO Contact Set ? "
                                      var ContactInput = {ContactID: MaxContactID, FirstName:FirstName,LastName:LastName, SiteAddress:SiteAddress,SiteCity:SiteCity,SiteState:SiteState,SiteZip:SiteZip,PhoneNumber:PhoneNumber ,ContactStatusID:ContactStatusID_INT,CompanyID:MaxCompanyID,EmailAddress:EmailAddress };
                                      console.log(ContactInput);
                                      //-----------------------------------------------------------------------------------------------
                                      var username = request.params.id;
                                      connection.query(insertContact,ContactInput,function(err,rows){
                                                       
                                                       if(!err ) {
                                                       //we sucessfully input the data into Contact ,then we should take care of the user_Contact;
                                                       var insertuc= "Insert Into user_Contact Set ? ";
                                                       var user_ContactInput={username:username, ContactID:MaxContactID};
                                                       console.log(user_ContactInput  );
                                //----------------------------------------------------------------------------------------------------------------------------------
                                                       connection.query(insertuc,user_ContactInput,function(err,rows){
                                                                        connection.release();
                                                                        if(!err ) {
                                                                        //we sucessfully input the data into user_Contact
                                                                        
                                                                        response.render('userPage',{ title:title ,usernameE: username, errorMessage:'Successful add Company and Contact Info'});
                                                                        }
                                                                        else{
                                                                        
                                                                        response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to insert into user_Contact2'});
                                                                        }
                                                                        });
                            //-----------------------------------------------------------------------------------------------------------------------------------
                                                       }
                                                       else{
                                                       
                                                       response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to insert into Contact'});
                                                       }
                                                       });
                                      //-----------------------------------------------------------------------------------------------
                                      }
                                      else{response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to Select ContactID Max'});}
                                      }//end if (!err)
                                      else{
                                      console.log("error in findind max ContactID");
                                      fs.readFile(template, function(err, data) {
                                                  var title = "Input into Company and Contact";
                                                  var username= request.params.id;
                                                  var output = ejs.render(data.toString(), {title:title, usernameE:username,errorMessage:'Something Error in find Max ContactID'});//,urlLink:url});
                                                  response.setHeader('Content-type', 'text/html');
                                                  response.end(output);
                                                  });
                                      }
                                      });
                     //----------------------------------------------------------------------------
                     }
                     }
                     else{
                     var title = "Input into Company and Contact";
                     response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to Select Contact'});
                     }
                     
                     });
    //-------------------------------------------------------------------------
                         connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                        });

    
}





function handle_input(request, response) {
    console.log('UICC handleInput');
    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in UICC.handle_input');
    } else {
    //console.log(request.body);
        var CompanyName=request.body.CompanyName;
        //console.log(CompanyName);
        var BillingAddress = request.body.BillingAddress;
        var BillingCity = request.body.BillingCity;
        var BillingState = request.body.BillingState;
        var BillingZip =request.body.BillingZip;
        var BillingContactFirstName = request.body.BillingContactFirstName;
        var BillingContactLastName = request.body.BillingContactLastName;
        var BillingContactEmail = request.body.BillingContactEmail;
       var BillingContactPhone = request.body.BillingContactPhone1+ request.body.BillingContactPhone2+ request.body.BillingContactPhone3;
        var CompanyStatusID= request.body.CompanyStatusID;
    //----------------------------------------------------------------
    //the following is the Contact information
    FirstName =request.body.FirstName;
    LastName = request.body.LastName;
    PhoneNumber = request.body.PhoneNumber1+request.body.PhoneNumber2+request.body.PhoneNumber3;
    EmailAddress = request.body.EmailAddress;
    SiteAddress = request.body.SiteAddress;
    SiteCity = request.body.SiteCity;
    SiteState = request.body.SiteState;
     SiteZip = request.body.SiteZip;
     ContactStatusID = request.body.ContactStatusID;
     MaxContactID = 0;
     MaxCompanyID = 0;
    title = "Input into Company and Contact";
    
    
         if(CompanyStatusID=='Yes')
         {
             var CompanyStatusID =1;
             //console.log('checked');
         }
        else
        {
            CompanyStatusID = 0;
        }

    

    //console.log(BillingAddress);
    
    poolH.getConnection(function(err,connection){
                       if (err) {
                       connection.release();
                     
                       response.json({"code" : 100, "status" : "Error in connection database"});
                       return;
                       }
                       var options = {sql: '...', nestTables: true};
                       console.log('connected as id ' + connection.threadId);
                       
                       //First we need to Search if the company is in the database, if it is, then just input the Contact
                       
                       queryClause="Select CompanyID As solution From Company Where CompanyName  = " +connection.escape(CompanyName) + " And  BillingAddress = " +connection.escape(BillingAddress)+"And BillingContactPhone="+ connection.escape(BillingContactPhone)+" And BillingContactFirstName=" + connection.escape(BillingContactFirstName)+" And BillingContactLastName = "+ connection.escape(BillingContactLastName)+";";
                       
                       console.log(queryClause);
                       connection.query(queryClause,function(err,rows){
                                        
                                        if(!err ) {
                                            if (rows[0]!=null)//we found the record, I assume that only one CompanyID can be found
                                            {
                                            console.log("this company is already in the database");
                                            MaxCompanyID=rows[0].solution;
                                            //-----------------------------------------------------------------------------------------
                                            //After Inserting into the Company, we need to insert into the Contact

                                            //then just check the Contact info
                                            handle_Contact(request,response);
                                            }
                                        
                                            else{//we didn't find the record,we should input it into the database
                                                    var findLargestCompanyID = "Select Max(CompanyID) AS solution from Company;";
                                        
                                                        connection.query(findLargestCompanyID,function(err,rows){//First, found the largest CompanyID;
                                                         
                                                         if(!err) {
                                                                         if(rows[0]!=null)
                                                                         {
                                                                         console.log('maxID rows is :'+rows[0]);
                                                                         MaxCompanyID= rows[0].solution+1;
                                                                         console.log('Now the max CPID is :'+MaxCompanyID);
                                                                         //--------------------------------------------------------------------------------------------------------------
                                                                        
                                                                         
                                                                         var insert="INSERT INTO Company Set ? ";
                                                                         var CompanyInput = {CompanyID: MaxCompanyID, CompanyName:CompanyName,BillingAddress:BillingAddress, BillingCity:BillingCity,BillingZip:BillingZip,BillingContactFirstName:BillingContactFirstName,BillingContactLastName:BillingContactLastName,BillingContactPhone:BillingContactPhone ,BillingContactEmail:BillingContactEmail,CompanyStatusID:CompanyStatusID, BillingState:BillingState  };
                                                                         
                                                                         connection.query(insert, CompanyInput ,function(err,rows){
                                                                                          connection.release();
                                                                                          if(!err ) {
                                                                                          //we sucessfully input the data into Company ,then we should take care of the Contact Info
                                                                                          handle_Contact_NEW(request,response);
                                                                                         //res.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Successfully Insertion into Company and Contact'});
                                                                                          }
                                                                                          else{
                                                                                          var title = "Input into Company and Contact";
                                                                                          response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to insert into Company'});
                    
                                                                                          }
                                                                                          });
                                                                         
                                                                         }
                                                                         else{console.log("error in finding max CompanyID" );
                                                                         response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to find max CompanyID'});
                                                                         }
                                                                         }//end if(!err) around line 304
                                                                         else{
                                                                         fs.readFile(template, function(err, data) {
                                                                                     var title = "Input into Company and Contact";
                                                                                     var username= request.params.id;
                                                                                     var output = ejs.render(data.toString(), {title:title, usernameE:username,errorMessage:'Something Error in find Max CompanyID'});//,urlLink:url});
                                                                                       response.setHeader('Content-type', 'text/html');
                                                                                       response.end(output);
                                                                                     });}});}}
                                        
                                        //-----------------------------------------------------------------------------------------
                                        //something error in queryClause
                                        else{
                                         fs.readFile(template, function(err, data) {
                                        
                                            var title = "Input into Company and Contact";
                                            var username= request.params.id;
                                                     var output = ejs.render(data.toString(), {title:title, usernameE:username,errorMessage:'Something Error in Select specific Company'});//,urlLink:url});
                                                    response.setHeader('Content-type', 'text/html');
                                                    response.end(output);
                                                    });
                                        }
                                        
                                        });
                       connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                        
                       });
  
    
   }
}




























// The Following handles with new Company, that means the company name changed.
function handle_Contact_NEW(request,response){//a new Company
    var ContactStatusID_INT=1;
    if(ContactStatusID=='Yes')
    {
        ContactStatusID_INT =1;
        //console.log('checked');
    }
    else
    {
        ContactStatusID_INT = 0;
    }
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        
                        response.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        
                        var queryClause2 ="Select ContactID As solution From Contact  Where FirstName  = " +connection.escape(FirstName) + " And  LastName = " +connection.escape(LastName)+"And PhoneNumber="+ connection.escape(PhoneNumber)+"And SiteAddress="+ connection.escape(SiteAddress)+";";
                        console.log(queryClause2);
                        
                        
                        //-------------------------------------------------------------------------
                        connection.query(queryClause2,function(err,rows){
                                         if(!err)
                                         {
                                         
                                         if(rows[0]!=null && rows[0].solution!=undefined)//we found the Contact also in the database, but the CompangID changed, so we should update the Contact Info.
                                         {
                                         console.log('The ContactID is :' +rows[0].solution);
                                         //than we check the Link between ContactID and User, is exists return already in the database
                                         MaxContactID=rows[0].solution;
                                         
                                         var updateContact = "Update Contact Set ? Where ContactID = "+rows[0].solution+";";
                                         updateData= {CompanyID : MaxCompanyID};
                                         //-------------------------------------------------------------------------------
                                         connection.query(updateContact,updateData ,function(err,rows)
                                                          {
                                                          if (!err){
                                                          //do next
                                                        //--------------------------------------------------------------------------------
                                                          var username = request.params.id;
                                                          var queryClause3="Select username as username1, ContactID  As ContactID1 From user_Contact Where username  = " +connection.escape(username) + " And  ContactID = " +connection.escape(MaxContactID)+";";
                                                          connection.query(queryClause3,function(err,rows){
                                                                           if(!err){
                                                                           if(rows[0]!=null)
                                                                           {
                                                                           console.log('the user_Contact is '+ rows[0].ContactID1+rows[0].username1);
                                                                           response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'System has already got this Contact. Company Informatoin has updated'});
                                                                           }
                                                                           else{//no such link record found
                                                                           var insertuc= "Insert Into user_Contact Set ?";
                                                                           var user_ContactInput={username:username, ContactID:MaxContactID};
                                                                           
                                                                           //-----------------------------------------------------------------------------------
                                                                           connection.query(insertuc,user_ContactInput,function(err,rows){
                                                                                            
                                                                                            if(!err ) {
                                                                                            //we sucessfully input the data into user_Contact
                                                                                            
                                                                                            
                                                                                            response.redirect('/userpage/'+username);
                                                                                            response.render('userPage',{ title:title ,usernameE: request.params.id, errorMessage:'Successful'});
                                                                                            }
                                                                                            else{
                                                                                            
                                                                                            response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to insert into user_Contact1'});
                                                                                            }
                                                                                            });
                                                                           //-------------------------------------------------------------------------------------------------------------------------------
                                                                           }
                                                                           }
                                                                           else{ response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to find link between user and Contact1'});}
                                                                           
                                                                           });
                                                          //----------------------------------------------------------------------------
                                                          }
                                                          else{response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to update Contact(CompangID)'});}
                                                          
                                                          });
                                        
                                         }
                                         else {
                                         //it's a new Contact, let's input it into the Contact
                                         var findLargestContactID = "Select Max(ContactID) AS solution from Contact;";
                                         //-----------------------------------------------------------------------------------------------
                                         //find max ContactID
                                         connection.query(findLargestContactID,function(err,rows){
                                                          if (!err)
                                                          {
                                                          if(rows[0]!=null &&rows[0].solution!=undefined)
                                                          {
                                                          
                                                          MaxContactID= rows[0].solution+1;
                                                          console.log('Now the max CTID is :'+MaxContactID);
                                                          //--------------------------------------------------------------------------------------------------------------
                                                          var insertContact="INSERT INTO Contact Set ? "
                                                          var ContactInput = {ContactID: MaxContactID, FirstName:FirstName,LastName:LastName, SiteAddress:SiteAddress,SiteCity:SiteCity,SiteState:SiteState,SiteZip:SiteZip,PhoneNumber:PhoneNumber ,ContactStatusID:ContactStatusID_INT,CompanyID:MaxCompanyID,EmailAddress:EmailAddress };
                                                          console.log(ContactInput);
                                                          //-----------------------------------------------------------------------------------------------
                                                          var username = request.params.id;
                                                          connection.query(insertContact,ContactInput,function(err,rows){
                                                                           
                                                                           if(!err ) {
                                                                           //we sucessfully input the data into Contact ,then we should take care of the user_Contact;
                                                                           var insertuc= "Insert Into user_Contact Set ? ";
                                                                           var user_ContactInput={username:username, ContactID:MaxContactID};
                                                                           console.log(user_ContactInput  );
                                                                           //----------------------------------------------------------------------------------------------------------------------------------
                                                                           connection.query(insertuc,user_ContactInput,function(err,rows){
                                                                                            connection.release();
                                                                                            if(!err ) {
                                                                                            //we sucessfully input the data into user_Contact
                                                                                            
                                                                                            response.render('userPage',{ title:title ,usernameE: username, errorMessage:'Successful add Company and Contact Info'});
                                                                                            }
                                                                                            else{
                                                                                            
                                                                                            response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to insert into user_Contact2'});
                                                                                            }
                                                                                            });
                                                                           //-----------------------------------------------------------------------------------------------------------------------------------
                                                                           }
                                                                           else{
                                                                           
                                                                           response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to insert into Contact'});
                                                                           }
                                                                           });
                                                          //-----------------------------------------------------------------------------------------------
                                                          }
                                                          else{response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to Select ContactID Max'});}
                                                          }//end if (!err)
                                                          else{
                                                          console.log("error in findind max ContactID");
                                                          fs.readFile(template, function(err, data) {
                                                                      var title = "Input into Company and Contact";
                                                                      var username= request.params.id;
                                                                      var output = ejs.render(data.toString(), {title:title, usernameE:username,errorMessage:'Something Error in find Max ContactID'});//,urlLink:url});
                                                                      response.setHeader('Content-type', 'text/html');
                                                                      response.end(output);
                                                                      });
                                                          }
                                                          });
                                         //----------------------------------------------------------------------------
                                         }
                                         }
                                         else{
                                         var title = "Input into Company and Contact";
                                         response.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Failed to Select Contact'});
                                         }
                                         
                                         });
                        //-------------------------------------------------------------------------
                        connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                        });
    
    
}



