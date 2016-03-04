var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Administrator Add New Contact';

var poolH = mysql.createPool({
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

exports.show=function(request,response)
{
    
    CompanyID= request.query.CompanyID;
    response.render('addNewContactAdmin',{title:'Add New Contact Admin',CompanyID:CompanyID});
}

exports.handle_Input=function (request,response)
{
    FirstName =request.body.FirstName;
    LastName = request.body.LastName;
    PhoneNumber = request.body.PhoneNumber1+request.body.PhoneNumber2+request.body.PhoneNumber3;
    EmailAddress = request.body.EmailAddress;
    SiteAddress = request.body.SiteAddress;
    SiteCity = request.body.SiteCity;
    SiteState = request.body.SiteState;
    SiteZip = request.body.SiteZip;
    ContactStatusID = request.body.ContactStatusID;
    var CompanyID = request.query.CompanyID;
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
                        
                        var queryClause2 ="Select ContactID As solution From Contact  Where FirstName  = " +connection.escape(FirstName) + " And  LastName = " +connection.escape(LastName)+"And PhoneNumber="+ connection.escape(PhoneNumber)+"And SiteAddress="+ connection.escape(SiteAddress)+" And CompanyID="+connection.escape(CompanyID)+";";
                        //console.log(queryClause2);
                        //-------------------------------------------------------------------------
                        connection.query(queryClause2,function(err,rows){
                                         
                                         if(!err)
                                         {
                                         
                                         if(rows[0]!=null && rows[0].solution!=undefined)//we found the Contact already in the database
                                         {
                                         //console.log('The ContactID is :' +rows[0].solution);
                                         //it's a new Contact, let's input it into the Contact
                                         res.redirect('http://localhost:9000/addNewContactAdmin?CompanyID='+CompanyID);
                                         }
                                         else{
                                         //we did not find that Contact, just insert
                                         var findLargestContactID = "Select Max(ContactID) AS solution from Contact;";
                                         //-----------------------------------------------------------------------------------------------
                                         //find max ContactID
                                         connection.query(findLargestContactID,function(err,rows){
                                                          if (!err)
                                                          {
                                                          if(rows[0]!=null &&rows[0].solution!=undefined)
                                                          {
                                                          
                                                          MaxContactID= rows[0].solution+1;
                                                         // console.log('Now the max CTID is :'+MaxContactID);
                                                          //--------------------------------------------------------------------------------------------------------------
                                                          var insertContact="INSERT INTO Contact Set ? "
                                                          var ContactInput = {ContactID: MaxContactID, FirstName:FirstName,LastName:LastName, SiteAddress:SiteAddress,SiteCity:SiteCity,SiteState:SiteState,SiteZip:SiteZip,PhoneNumber:PhoneNumber ,ContactStatusID:ContactStatusID_INT,CompanyID:CompanyID,EmailAddress:EmailAddress };
                                                         // console.log(ContactInput);
                                                          //-----------------------------------------------------------------------------------------------
                                                         
                                                          connection.query(insertContact,ContactInput,function(err,rows){
                                                                           
                                                                           if(!err ) {
                                                                           //we sucessfully input the data into Contact ,then we should take care of the user_Contact;
                                                                           console.log("Succesfully insert Contact!!");
                                                                           response.redirect('http://localhost:9000/chooseExistingVehicle/'+MaxContactID+'?ContactName='+FirstName+' '+LastName+'?CompanyID='+CompanyID)
                                                                           }
                                                                           //-----------------------------------------------------------------------------------------------------------------------------------
                                                                           else{
                                                                           
                                                                           response.render('addNewContactAdmin',{ title:title ,CompanyID:CompanyID,errorMessage:'Failed to insert into Contact'});
                                                                           }
                                                                           });
                                                          //-----------------------------------------------------------------------------------------------
                                                          }
                                                          else{response.render('addNewContactAdmin',{ title:title ,CompanyID:CompanyID, errorMessage:'Failed to Select ContactID Max'});}
                                                          }
                                                          });
                                         }
                                         }
                                         else{
                                         response.render('addNewContactAdmin',{ title:title , CompanyID:CompanyID,errorMessage:'Failed to Select Specific ContactID:'+err.code});
                                         }});
                                                                                //-------------------------------------------------------------------------
                        connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                        });

}