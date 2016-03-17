var fs = require('fs');
var ejs=require('ejs');
var mysql = require('mysql');
var nodemailer = require("nodemailer");
var template = './views/login.ejs';
var template2= './views/inputSelection.ejs';
var insert = './views/insert.ejs';
var smtpPool = require('nodemailer-smtp-pool');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var ContactID = new Array();
var ContactName = new Array();
var ContactSiteAddress=new Array();
var ContactPhone = new Array();

var ContactCount=0;

var title= 'Please input the detail of your requirements';
var h1=title;

var datetime = new Date();
var month ="";
if (datetime.getMonth()<9)
{
    month = "0"+(datetime.getMonth()+1).toString();
    
}else {month =(datetime.getMonth()+1).toString();}

var today = datetime.getFullYear()+"-"+month+"-"+datetime.getDate();
console.log(today);


/*var generator = require('xoauth2').createXOAuth2Generator({
                                                          user: 'gaogarychina@gmail.com',
                                                          clientId: '228113790507-lugd7ihd9ikkod7v9ads1jh8ehskin0m.apps.googleusercontent.com',
                                                          clientSecret: '1oj7wKXYpn6dh2DipgN5OWO0',
                                                          refreshToken: '1/4Raz6dkyiPl45eUKr6oIzN5oCW5mxhrmfD8IkPnVPpU'
                                                         // accessToken: '{cached access token}' // optional
                                                          });
*/

var SMTPtransport =nodemailer.createTransport("SMTP",{
                                    service: 'gmail',
                                    auth: {
                                              XOAuth2: {
                                              user: "gaogarychina@gmail.com", // Your gmail address.
                                              // Not @developer.gserviceaccount.com
                                              clientId: "228113790507-lugd7ihd9ikkod7v9ads1jh8ehskin0m.apps.googleusercontent.com",
                                              clientSecret: "1oj7wKXYpn6dh2DipgN5OWO0",
                                              refreshToken: "1/4Raz6dkyiPl45eUKr6oIzN5oCW5mxhrmfD8IkPnVPpU"
                                              }
                                    },
                                    maxConnections: 5,
                                    maxMessages: 10
                                    });



// custom library
// model
var VIN="";
var Date1="";
var PO="";
var WO="";
var ContactID_Specific="";
var VehicleTotalMileage=0;
var VehicleTotalHours=0 ;
var VehicleMake="";
var VehicleModel="";
var UnitNumber="" ;
var JobLocation="";
var TypeOfDPF = "";
var username = "";
var JobID ="";

var Model = require('./model');

var queryClause="";
var poolH     =    mysql.createPool({
                                   connectionLimit : 100, //important
                                   host     : 'localhost',
                                   user     : 'Xig514',
                                   password : 'some_pass',
                                   database : 'Hunsicker',
                                   debug    :  false
                                   });


var showDetailedRequirements = function(request, response) {
  if(!request.isAuthenticated()) {
       response.redirect('/login');
       console.log('not authed in inputSelection');
    } else {
    
    username= request.params.id;
    
    getContactID(request,response);

    }};



var handle_JobRequest = function (request,response)
{
    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in inputSelection');
    } else {
    username = request.params.id;
    
     VIN=request.body.VIN;
     Date1 = request.body.Date;
     PO=request.body.PurchaseOrderNumber;
     WO =request.body.WorkOrderNumber;
     ContactID_Specific = request.body.ContactID;
     VehicleTotalMileage = request.body.VehicleTotalMileage;
     VehicleTotalHours = request.body.VehicleTotalHours;
     console.log('mileage and hours are:' +VehicleTotalMileage +VehicleTotalHours);
     VehicleMake = request.body.VehicleMake;
     VehicleModel = request.body.VehicleModel;
     UnitNumber = request.body.Unit_Truck_Number;
     JobLocation = request.body.JobLocation;
    TypeOfDPF= request.body.TypeOfDPF;
    var res = Date1.split("-");
    
    var year = res[0];
    var month= res[1];
    var day = res[2];
  
       JobID = JobLocation+ year.substr(year.length - 2)+month+day;
    console.log (JobID);
    var queryClause="SELECT JobID FROM Job WHERE JobID Like '"+JobID+"%' ORDER BY JobID DESC LIMIT 1 ;"
    //JobID consists of FirstTwo letter of Location, year(two digis)+month (2 digits)+ Day (2 digits)+SequenceNumber;
    //Search for the Sequence number
    console.log(queryClause);
    
     poolH.getConnection(function(err,connection){
     if (err) {
     connection.release();
     
     response.json({"code" : 100, "status" : "Error in connection database"});
     return;
     }
                         
     connection.query(queryClause,function(err,rows){
                      connection.release();
     if(!err)
     {
            if ( rows[0]!=null )
                      {
                      var JobID_Last = rows[0].JobID;
                      var JobID_SN = JobID_Last.substr(JobID_Last.length - 2);
                      var JobID_SN_INT =parseInt(JobID_SN)+1 ;
                      if(JobID_SN_INT<10)
                      JobID=JobID +"0"+JobID_SN_INT.toString();
                      else JobID = JobID +JobID_SN_INT.toString();
                      //--------------------------------------------------------------------------------------------------------------------------------------------------
                      // now we have the JobID, Just insert it in to the database.
                     // console.log(JobID_Last+ " : "+JobID);
                     // console.log(Date1 +"   WO "+WO+"   PO "+PO+"  VIN  "+VIN+"  VTM  "+VehicleTotalMileage+"  VTH  "+VehicleTotalHours+"    ");
                      //First Let's check if the VIN is already in the Database.
                      VehicleCheck(request,response);

                      //--------------------------------------------------------------------------------------------------------------------------------------------------
                      //--------------------------------------------------------------------------------------------------------------------------------------------------
                     //--------------------------------------------------------------------------------------------------------------------------------------------------
                      //--------------------------------------------------------------------------------------------------------------------------------------------------
                      //--------------------------------------------------------------------------------------------------------------------------------------------------
                      }
            else
                {
                      console.log("No Result For this database for this day, so we new a record" );
                       JobID =JobID+"01";
                      console.log(JobID);
                      console.log(ContactID_Specific);
                      console.log(VIN);
                      console.log(Date1 +"   WO "+WO+"   PO "+PO+"  VIN  "+VIN+"  VTM  "+VehicleTotalMileage+"  VTH  "+VehicleTotalHours+"    ");
                      VehicleCheck(request, response);
                      return;
                      
                      }
     }
     else{
                      
                      response.render('userRequireANewJob', {usernameE:username,title: title, h1: h1,ContactID:ContactID,ContactCount:ContactCount,ContactName:ContactName,ContactPhone:ContactPhone, ContactSiteAddress:ContactSiteAddress,Today:today,errorMessage:'error in Select JobID'});
     }
     
     });
     //-------------------------------------------------------------------------
     connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
     
     
     });
     
    }
    
    
    
    
}
function getContactID(req,res)
{

    console.log(username);
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        //queryClause = "Select ContactID As Solution From user_Contact;";
                        queryClause="Select x.count as ContactCount, ContactID As Solution From user_Contact, (select count(*) as count FROM user_Contact Where user_Contact.username= "+connection.escape(username)+"   ) as x  Where username = "+connection.escape(username)+";";

                        connection.query(queryClause,function(err,rows){
                                         
                                         if(!err)
                                         {
                                                if(rows[0]!=null && rows[0].Solution!= undefined)
                                                {
                                                        //console.log('found'+rows[0].Solution+rows[1].Solution+rows[2].Solution+rows[3].Solution);
                                         
                                         
                                                        for(var i =0; i<rows[0].ContactCount;i++)
                                                       // while(rows[i]!=null && rows[i].Solution !=undefined )
                                                    {
                                         
                                                    if(rows[i]==null || rows[i].Solution==undefined)
                                                        {
                                                            break;
                                                        }

                                         
                                                            console.log('i   =' +i);
                                                            ContactID[i]= rows[i].Solution;
                                                            console.log('ContactID = ' +ContactID[i]);
                                         

                                         
                                                    }

                                          ContactCount=ContactID.length;
                                         console.log("ContactLength is " + ContactCount);
                                         //so now we have the ContactID and we want to get the ContactName, Contact Phone, and Address.
                                         var queryClause2 = "Select FirstName As fn, LastName As ln, PhoneNumber As pn, SiteAddress As sa From Contact Where ContactID = ";
                                         for (var i =0;i<ContactCount;i++)
                                         {
                                         if(ContactID[i]!=undefined)
                                         queryClause2=queryClause2+connection.escape(ContactID[i]);
                                         if(ContactID[i+1]==undefined)
                                         {
                                         queryClause2=queryClause2+" ; ";
                                         
                                         
                                         }
                                         else queryClause2=queryClause2+" Or ContactID = ";
                                         }
                                         console.log(queryClause2);//correct
                                         connection.query(queryClause2,function(err,rows){
                                                          
                                                          if(!err){
                                                          console.log('successfully get the contact info');
                                                          for(var i =0; i <ContactCount ; i++)
                                                          {
                                                          if (rows[i]!=null && rows[i].fn!= undefined)
                                                          {
                                                          ContactName[i]=rows[i].fn+" "+rows[i].ln;
                                                          ContactPhone[i]=rows[i].pn;
                                                          ContactSiteAddress[i]=rows[i].sa;
                                                          
                                                          }
                                                          }//end for(var i =0; i <ContactCount ; i++)
                                              
                                                          console.log("today is "+today );
                                                          res.render('userRequireANewJob', {usernameE:username,title: title, h1: h1,ContactID:ContactID,ContactCount:ContactCount,ContactName:ContactName,ContactPhone:ContactPhone, ContactSiteAddress:ContactSiteAddress,Today:today});
                                                          }//end if(!err)
                                                          else{
                                                          console.log('error in Select ContactInfo!');
                                                          
                                                          res.reder('errorPage', {usernameE: username,errorMessage :'Error in Select ContactInfo!'});
                                                          return;

                                                          
                                                          }
                                                          
                                                          
                                                          });
                                         
                                         //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

                                         
                                                }
                                                else
                                                {
                                         console.log('no such contact for you');
                                         ContactID[0]='none';
                                         var h1=' New Job Request';
                                         var ContactCount = 0;
                              
                                         res.render('userRequireANewJob', {usernameE:req.params.id,title: 'Input details', h1: h1,ContactID:ContactID, ContactCount:ContactCount, ContactName:ContactName,ContactPhone:ContactPhone, ContactSiteAddress:ContactSiteAddress,Today:today,errorMessage: 'No Contact records for you. Please input the Contact information First.'});
                                         
                                         }
                                        }
                                         else{
                                          console.log('error in Select ContactID!');
                                         var title = "Require a new job";
                                         res.reder('errorPage', {usernameE: username,errorMessage :'Error in Select ContactID!'});
                                         return;
                                        
                                         }
                                         
                                         });
                        //-------------------------------------------------------------------------
                        connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                        
                        });
                        
    
    
    
}


                         
                         
                         
                         
                         
                         
                         function VehicleCheck(request,response){
                         poolH.getConnection(function(err,connection){
                                             if (err) {
                                             connection.release();
                                             res.json({"code" : 100, "status" : "Error in connection database"});
                                             return;
                                             }
        //----------------------------------------------------------------------------------------------------------------------------------------------
                                             console.log('In Vehicle Check');
                                             //First Let's check if the VIN is already in the Database.
                                             var checkVehicle = "Select Count(1) as countNum FROM Vehicle WHERE VIN ="+connection.escape(VIN)+";";
                                             
                                             connection.query(checkVehicle,function(err,rows){
                                                              
                                                              console.log('in query');
                                                              if(!err)
                                                              {
                                                              //console.log(rows[0]);
                                                              if (rows[0].countNum==1)
                                                              {
                                                              // we should directly insert into the Job and without the DPFID
                                                              console.log('Found this Vehicle');
                                                              InsertJob(request,response);
                                                              }
                                                              else if (rows[0].countNum==0)
                                                              {
                                                                            //we should InsertInto Vehicle First
                                                              console.log('Not Found This Vehicle');
                                                              
                                                              //First search for the largest Vehicle ID
                                                              var checkVehicleID = "Select max(VehicleID) as max from Vehicle;"
                                                              connection.query(checkVehicleID,function(err,rows){
                                                                               if(!err){
                                                                               if(rows[0]!=undefined &&rows[0]!=null)
                                                                               {
                                                                               var new_VehicleID = parseInt(rows[0].max)+1;
                                                                               console.log(new_VehicleID);
                                                                               var VehicleInput ={VIN:VIN, VehicleMake: VehicleMake,VehicleModel:VehicleModel,UnitNumber:UnitNumber,VehicleID :new_VehicleID };
                                                                               var InsertVehicle="Insert into Vehicle Set ? ";
                                                                               connection.query(InsertVehicle , VehicleInput, function(err,rows){
                                                                                                if (!err)
                                                                                                {
                                                                                                //Successful insertion, then the Job.
                                                                                                console.log('sc insert vehicle');
                                                                                                InsertJob(request,response);
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                console.log(err.code);
                                                                                                response.render('errorPage',{usernameE: username, h1:'Error Page', title:'Error Page', errorMessage:err.code});
                                                                                                }
                                                                                                });
                                                                               

                                                                               }
                                                                               else{
                                                                               var new_VehicleID = 1;
                                                                               console.log(new_VehicleID);
                                                                               var VehicleInput ={VIN:VIN, VehicleMake: VehicleMake,VehicleModel:VehicleModel,UnitNumber:UnitNumber,VehicleID :new_VehicleID };
                                                                               var InsertVehicle="Insert into Vehicle Set ? ";
                                                                               connection.query(InsertVehicle , VehicleInput, function(err,rows){
                                                                                                if (!err)
                                                                                                {
                                                                                                //Successful insertion, then the Job.
                                                                                                console.log('sc insert vehicle');
                                                                                                InsertJob(request,response);
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                console.log(err.code);
                                                                                                response.render('errorPage',{usernameE: username, h1:'Error Page', title:'Error Page', errorMessage:err.code});
                                                                                                }
                                                                                                });
                                                                               

                                                                               }
                                                                               
                                                                               }else{
                                                                               console.log('error in check VehicleID');
                                                                               response.render('errorPage',{usernameE: username, h1:'Error Page', title:'Error Page', errorMessage:err.code});
                                                                               }
                                                                               
                                                                               });
                                                        
                                                                            }
                                                            
                                                              
                                                              
                                                              
                                                              }
                                                              else{response.render('errorPage',{usernameE: username, h1:'Error Page', title:'Error Page',errorMessage:err.code})}
                                                              
                                                              });
        //----------------------------------------------------------------------------------------------------------------------------------------------
                                            
                                             connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                                             
                                             });

                                             
                                             

                         
                         
                         
                         
                         }

                         
                         
                         
                         
                         
                         
                         
                         
function InsertJob(request,response)
                         {
                             poolH.getConnection(function(err,connection){
                                                 if (err) {
                                                 connection.release();
                                                 res.json({"code" : 100, "status" : "Error in connection database"});
                                                 return;
                                                 }
                                                 
                    //----------------------------------------------------------------------------------------------------------------------------------------------
                                                 if(VehicleTotalHours==""||VehicleTotalHours==''|| VehicleTotalHours==null)
                                                 {
                                                    VehicleTotalHours=0;
                                                 }
                                                 if(VehicleTotalMileage=="" || VehicleTotalMileage=='' ||VehicleTotalMileage==null)
                                                 {
                                                    VehicleTotalMileage=0;
                                                 }
                                                 var checkJob= "Select Count(1) as countNum , JobID as jbid FROM Job WHERE VIN = "+connection.escape(VIN) +" And ContactID = " +connection.escape(ContactID_Specific)+" And StartTime = "+ connection.escape(Date1)+";";
                                                 console.log(checkJob);

                                                 //" and VehicleTotalHours= "+ connection.escape(VehicleTotalHours) + "and VehicleTotalMileage = " + connection.escape(VehicleTotalMileage)
                                                 connection.query (checkJob,function (err,rows){
                                                                   if(!err)
                                                                   {
                                                                   if (rows[0].countNum==1)
                                                                   {
                                                                   JobID = rows[0].jbid;
                                                                   // we found this contact has already get this Job, Just
                                                                   response.render('userPage', {title: 'userPage',JobID :JobID,usernameE: username, errorMessage:'You have already required a Job for this Vehicle: '+VIN});
                                                                   console.log('Found this Job');
                                                                   connection.release();
                                                                   
                                                                   }
                                                                   else if (rows[0].countNum==0)
                                                                   {
                                                                   var JobInput={JobID:JobID, ContactID:ContactID_Specific, StartTime:Date1,WorkOrderNumber:WO,PurchaseOrderNumber:PO,VIN:VIN, VehicleTotalMileage:VehicleTotalMileage,VehicleTotalHours:VehicleTotalHours,JobLocation:'Fogelsville'};
                                                                   console.log(JobInput);
                                                                   var queryClause2="Insert Into Job Set ?";
                                                                   connection.query(queryClause2,JobInput, function (err,rows){
                                                                                    connection.release();
                                                                                    if(!err){
                                                                                    // That's a try;
                                                                                    
                                                                                    //response.redirect('userPage/'+username);
                                                                                    response.render('userPage', {title: 'userPage',JobID :JobID,usernameE: username, errorMessage:'Successful Request!'})
                                                                                    
                                                                                    }
                                                                                    else{
                                                                                    console.log(JobID);
                                                                                    response.render('userRequireANewJob', {usernameE:username,title: title, h1: h1,ContactID:ContactID,ContactCount:ContactCount,ContactName:ContactName,ContactPhone:ContactPhone, ContactSiteAddress:ContactSiteAddress,Today:today,errorMessage:err.code});}
                                                                                    var mailOptions = {
                                                                                    from: "gaogarychina@gmail.com", // sender address
                                                                                    to: "xig514@lehigh.edu", // list of receivers
                                                                                    subject: "Hello ✔", // Subject line
                                                                                    text: "Hello world ✔", // plaintext body
                                                                                    html: '<a href="http://localhost:9000/login">Login</a>' // html body
                                                                                    }
                                                                                    
                                                                                    SMTPtransport.sendMail(mailOptions, function(error, response){
                                                                                                           if(error){
                                                                                                           console.log("Error FOUND! "+error);
                                                                                                           }else{
                                                                                                           console.log("Message sent: " + response.message);
                                                                                                           }
                                                                                                           SMTPtransport.close();
                                                                                                           });
                                                                                    

                                                                                    });

                                                                   
                                                                   }
                                                                   }
                                                                   else
                                                                   {
                                                                   console.log('error in selecting Job');
                                                                   response.render('errorPage',{usernameE: username, h1:'Error Page', title:'Error Page',errorMessage:err.code})
                                                                   
                                                                   }
                                                                   
                                                                   });
                                                 
                                                 
                                                 
                                                 
                //----------------------------------------------------------------------------------------------------------------------------------------------

                             connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                                                 });
                         
                         };
module.exports.NewJob = showDetailedRequirements;
module.exports.NewJobPost = handle_JobRequest;
