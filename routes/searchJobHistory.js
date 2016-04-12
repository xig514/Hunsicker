var mysql     =    require('mysql');
var ejs = require ('ejs');
var template = './views/searchJobHistory.ejs';
var title = 'Job History';
var fs = require('fs');

var numberRows;
var numberFields;
var dataForShowing= new Array();
var nameOfFields= new Array();
var queryClause="";
var poolH     =    mysql.createPool({
                                    connectionLimit : 100, //important
                                    host     : 'localhost',
                                    user     : 'Xig514',
                                    password : 'some_pass',
                                    database : 'Hunsicker',
                                    debug    :  false
                                    });

var queryClause="";

function getdata(request,response,index)
{
    console.log('Job');
   
    poolH.getConnection(function(err,connection){
                       if (err) {
                       connection.release();
                       response.json({"code" : 100, "status" : "Error in connection database"});
                       return;
                       }
                       var options = {sql: '...', nestTables: true};
                       console.log('connected as id ' + connection.threadId);
                         queryClause="Select * From Job inner join user_Contact on Hunsicker.Job.ContactID=Hunsicker.user_Contact.ContactID Where username =" + connection.escape(index)+";";
                       connection.query(queryClause,function(err,rows,fields){
                                        connection.release();
                                        if(!err) {
                                        
                                        numberRows=rows.length;
                                        
                                        console.log(numberRows);
                                        console.log(fields.length);
                                        numberFields= fields.length;
                                        for (var i=0; i < numberFields; i ++)
                                        {
                                        
                                        nameOfFields[i]=fields[i].name;
                                        
                                        }
                                        
                                        for (var i = 0; i < numberRows;i++)
                                        {
                                        
                                        dataForShowing[i]=new Array(numberFields);
                                        dataForShowing[i][0]=(rows[i].JobID);
                                        dataForShowing[i][1]=(rows[i].ContactID);
                                        dataForShowing[i][2]=(rows[i].WorkOrderNumber);
                                        dataForShowing[i][3]=(rows[i].PurchaseOrderNumber);
                                        dataForShowing[i][4]=(rows[i].StartTime);
                                        dataForShowing[i][5]=(rows[i].EndTime);
                                        dataForShowing[i][6]=(rows[i].VIN);
                                        dataForShowing[i][7]=(rows[i].VehicleTotalMileage);
                                        dataForShowing[i][8]=(rows[i].VehicleTotalHours);
                                        dataForShowing[i][9]=(rows[i].DPFID);
                                        dataForShowing[i][10]=(rows[i].ReasonForCleaning);
                                        dataForShowing[i][11]=(rows[i].TypeOfDriving);
                                        dataForShowing[i][12]=(rows[i].OldJobID);
                                        dataForShowing[i][13]=(rows[i].JobLocation);
                                        
                                        
                                        }
                                        fs.readFile(template, function(err, data) {
                                                    
                                                    
                                                    
                                                    //var output = ejs.render(data.toString(), {title: title,numberRows:numberRowsE,numberFields:numberFieldsE,ContactID:ContactIDE,CompanyID:CompanyIDE,FirstName:FirstnameE,LastName:LastNameE, PhoneNumber:PhoneNumberE,EmailAddress:EmailAddressE,SiteAddress:SiteAddressE
                                                    //                SiteCity:SiteCityE, SIteState:SIteStateE,SiteZip:SiteZipE,ContactStatusID:ContactStatusIDE});
                                                    
                                                    
                                                    
                                                    var output = ejs.render(data.toString(),{usernameE:index,title:title,h1 :title,numberRowsE:numberRows,numberFieldsE: numberFields-2, dataForShowingE:dataForShowing, nameOfFieldsE : nameOfFields});
                                                    response.setHeader('Content-type', 'text/html');
                                                    response.end(output);
                                                    
                                                    
                                                    });
                                        }
                                        
                                        });
                       connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                       });
    
}





exports.showData=function(request,response)
{
    var user = request.user;

     user = user.toJSON();
console.log(user);
    if(!request.isAuthenticated()) {
       response.redirect('/login');
       
    } else {
    var username=request.params.id;
  

/*
    var JobID=[];
    var ContactID=[];
    var WorkOrderNumber=[];
    var PurchaseOrderNumber=[];
    var StartTime=[];
    var EndTime=[];
    var VIN=[];
    var VehicleTotalMileage=[];
    var VehicleTotalHours=[];
    var DPFID=[];
    var ReasonForCleaning=[];
    var TypeOfDriving=[];
    var OldJobID=[];
    var JobLocation=[];
  */
    numberRows=1;
    getdata(request,response,username);
    
}
}

