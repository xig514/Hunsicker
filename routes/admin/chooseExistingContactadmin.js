var fs = require('fs');
var ejs=require('ejs');
var mysql = require('mysql');


var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var ContactID = new Array();
var ContactName = new Array();
var ContactSiteAddress=new Array();
var ContactPhone = new Array();

var ContactCount=0;

var title= 'All Contact Information';
var h1=title;

var dataForShowing= new Array();
// custom library
// model

var ContactID_Specific="";

var username = "";


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


var showcheckExistingContact = function(request, response) {
  if(!request.isAuthenticated()) {
       response.redirect('/login');
       console.log('not authed in inputSelection');
    } else {
    
    username= request.params.id;
    
    getContactID(request,response);

    }};



function getContactID(req,res)
{

    //console.log(username);
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        //queryClause = "Select ContactID As Solution From user_Contact;";
                        queryClause="Select ContactID As Solution From user_Contact Where username = "+connection.escape(username)+";";
                        connection.query(queryClause,function(err,rows){
                                         
                                         if(!err)
                                         {
                                                if(rows[0]!=null && rows[0].Solution!= undefined)
                                                {
                                                        console.log('found'+rows[0].Solution+rows[1].Solution+rows[2].Solution+rows[3].Solution);
                                         
                                         
                                                        for(var i =0; i<10;i++)
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
                                        // console.log("ContactLength is " + ContactCount);
                                         //so now we have the ContactID and we want to get the ContactName, Contact Phone, and Address.
                                         var queryClause2 = "Select FirstName As fn, LastName As ln, PhoneNumber As pn, SiteAddress As sa, EmailAddress as ea, SiteCity as sc, SiteState as ss, SiteZip as sz From Contact Where ContactID = ";
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
                                         //console.log(queryClause2);//correct
                                         connection.query(queryClause2,function(err,rows,fields){
                                                          connection.release();
                                                          if(!err){
                                                          console.log('successfully get the contact info');
                                                          var fieldsCount = fields.length;
                                                          for(var i =0; i <ContactCount ; i++)
                                                          {
                                                          if (rows[i]!=null && rows[i].fn!= undefined)
                                                          {
                                                          ContactName[i]=rows[i].fn+" "+rows[i].ln;
                                                          ContactPhone[i]=rows[i].pn;
                                                          ContactSiteAddress[i]=rows[i].sa;
                                                          
                                                          dataForShowing[i]=new Array(9);
                                                          dataForShowing[i][0]=ContactID[i];
                                                         
                                                          dataForShowing[i][1]=rows[i].fn;
                                                          dataForShowing[i][2]=rows[i].ln;
                                                          dataForShowing[i][3]=rows[i].pn;
                                                          dataForShowing[i][4]=rows[i].sa;
                                                          dataForShowing[i][5]=rows[i].ea;
                                                          dataForShowing[i][6]=rows[i].sc;
                                                          dataForShowing[i][7]=rows[i].ss;
                                                          dataForShowing[i][8]=rows[i].sz;
                                                          //console.log(dataForShowing[i]);
                                                          }
                                                          }//end for(var i =0; i <ContactCount ; i++)
                                                          
                                                          
                                                          
                                                          
                                                          
                                                          res.render('checkExistingContact', {usernameE:username,title: 'Your Contact Information', h1: 'Your Contact Information',ContactID:ContactID,ContactCount:ContactCount,ContactName:ContactName,ContactPhone:ContactPhone, ContactSiteAddress:ContactSiteAddress,dataForShowingE:dataForShowing});
                                                          }//end if(!err)
                                                          else{
                                                          console.log('error in Select ContactInfo!');
                                                          
                                                          res.reder('errorPage', {usernameE: username,h1:'Error in Select Contact Infomation',errorMessage :'Error in Select ContactInfo!'});
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
                              
                                         res.render('checkExistingContact', {usernameE:req.params.id,title: title, h1: h1,ContactID:ContactID, ContactCount:ContactCount, ContactName:ContactName,ContactPhone:ContactPhone, ContactSiteAddress:ContactSiteAddress,errorMessage: 'No Contact records for you. Please input the Contact information First.'});
                                         
                                         }
                                        }
                                         else{
                                          console.log('error in Select ContactID!');
                                          title = "Require a new job";
                                         res.render('errorPage', {usernameE: username,errorMessage :'Error in Select ContactID!'});
                                         return;
                                        
                                         }
                                         
                                         });
                        //-------------------------------------------------------------------------
                        connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                        
                        });
                        
    
    
    
}


                         
                         
                         

                         
                         
                         
                         
                         
                         

module.exports.showcheckExistingContact = showcheckExistingContact;

