
var mysql     =    require('mysql');
var ejs = require ('ejs');
var template = './views/database.ejs';
var title = 'Hi Bob';
var fs = require('fs');

var numberRows;
var numberFields;
var dataForShowing= new Array();
var nameOfFields= new Array();
var queryClause="";
var pool     =    mysql.createPool({
                                    connectionLimit : 100, //important
                                    host     : 'localhost',
                                    user     : 'Xig514',
                                    password : 'some_pass',
                                    database : 'Hunsicker',
                                    debug    :  false
                                    });

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 100000; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function handle_database(req,res) {
var user = req.user;
    if(!request.isAuthenticated()  || user.username!='adminBob') {
       response.redirect('/login');
       
    } else {
    console.log(user.username)
    pool.getConnection(function(err,connection){
                       if (err) {
                       connection.release();
                       res.json({"code" : 100, "status" : "Error in connection database"});
                       return;
                       }
                       
                       console.log('connected as id ' + connection.threadId);
                       
                       connection.query("select * from Contact",function(err,rows){
                                        connection.release();
                                        if(!err) {
                                        res.json(rows);
                                        }           
                                        });
                       
                       connection.on('error', function(err) {      
                                     res.json({"code" : 100, "status" : "Error in connection database"});
                                     return;     
                                     });
                       });
}

}



function getdata(req,res,index){
    
    
    if (index ==0)// It's for Contact search
    {
        console.log('Contact');
        queryClause="Select * From Contact";
        pool.getConnection(function(err,connection){
                           if (err) {
                           connection.release();
                           response.json({"code" : 100, "status" : "Error in connection database"});
                           return;
                           }
                           var options = {sql: '...', nestTables: true};
                           console.log('connected as id ' + connection.threadId);
                           connection.query(queryClause,function(err,rows,fields){
                                            connection.release();
                                            if(!err) {
                                            //response.json(rows);
                                            
                                            //response.json(rows[0]);
                                            numberRows=rows.length;
                                            
                                            
                                            
                                            numberFields= fields.length;
                                            console.log(numberFields);
                                            
                                            for (var i=0; i < numberFields; i ++)
                                            {
                                            
                                            nameOfFields[i]=fields[i].name;
                                            
                                            }
                                            
                                            for (var i = 0; i < numberRows;i++)
                                            {
                                            dataForShowing[i]=new Array(numberFields);
                                            dataForShowing[i][0]=(rows[i].ContactID);
                                            dataForShowing[i][1]=(rows[i].CompanyID);
                                            dataForShowing[i][2]=(rows[i].FirstName);
                                            dataForShowing[i][3]=(rows[i].LastName);
                                            dataForShowing[i][4]=(rows[i].PhoneNumber);
                                            dataForShowing[i][5]=(rows[i].EmailAddress);
                                            dataForShowing[i][6]=(rows[i].SiteAddress);
                                            dataForShowing[i][7]=(rows[i].SiteCity);
                                            dataForShowing[i][8]=(rows[i].SiteState);
                                            dataForShowing[i][9]=(rows[i].SiteZip);
                                            dataForShowing[i][10]=(rows[i].ContactStatusID);
                                            /* ContactID.push(rows[i].ContactID);
                                             CompanyID.push(rows[i].CompanyiD);
                                             FirstName.push(rows[i].FirstName);
                                             LastName.push(rows[i].LastName);
                                             PhoneNumber.push(rows[i].PhoneNumber);
                                             EmailAddress.push(rows[i].EmailAddress);
                                             SiteAddress.push(rows[i].SiteAddress);
                                             SiteCity.push(rows[i].SiteCity);
                                             SIteState.push(rows[i].SIteState);
                                             SiteZip.push(rows[i].SiteZip);
                                             ContactStatusID.push(rows[i].ContactStatusID);*/
                                            }
                                            console.log(dataForShowing[0][8]);
                                            //console.log(rows[0].ContactStatusID);
                                            fs.readFile(template, function(err, data) {
                                                        
                                                        
                                                        
                                                        //var output = ejs.render(data.toString(), {title: title,numberRows:numberRowsE,numberFields:numberFieldsE,ContactID:ContactIDE,CompanyID:CompanyIDE,FirstName:FirstnameE,LastName:LastNameE, PhoneNumber:PhoneNumberE,EmailAddress:EmailAddressE,SiteAddress:SiteAddressE
                                                        //                SiteCity:SiteCityE, SIteState:SIteStateE,SiteZip:SiteZipE,ContactStatusID:ContactStatusIDE});
                                                        
                                                     
                                                        console.log('numberRows!!!!='+numberRows);
                                                        
                                                        var output = ejs.render(data.toString(),{title:title, numberRowsE:numberRows,numberFieldsE: numberFields, dataForShowingE:dataForShowing, nameOfFieldsE:nameOfFields});
                                                        res.setHeader('Content-type', 'text/html');
                                                        res.end(output);
                                                   
                        
                                                        });
                                            }
                                         
                                            });
                           connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                           });
    }
    if (index ==1)// It's for Job search
    {
        console.log('Job');
        queryClause="Select * From Job";
        pool.getConnection(function(err,connection){
                           if (err) {
                           connection.release();
                           response.json({"code" : 100, "status" : "Error in connection database"});
                           return;
                           }
                           var options = {sql: '...', nestTables: true};
                           console.log('connected as id ' + connection.threadId);
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
                                                        
                                                        
                                                        console.log('numberRows!!!!='+numberRows);
                                                        var output = ejs.render(data.toString(),{title:title, numberRowsE:numberRows,numberFieldsE: numberFields, dataForShowingE:dataForShowing, nameOfFieldsE : nameOfFields});
                                                        res.setHeader('Content-type', 'text/html');
                                                        res.end(output);
                                                        
                                                        
                                                        });
                                            }
                                            
                                            });
                           connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                           });

    }
    if (index ==2)// It's for Vehicle search
    {
        console.log('Vehicle');
        queryClause="Select * From Vehicle";
       
        pool.getConnection(function(err,connection){
                           if (err) {
                           connection.release();
                           response.json({"code" : 100, "status" : "Error in connection database"});
                           return;
                           }
                           var options = {sql: '...', nestTables: true};
                           console.log('connected as id ' + connection.threadId);
                           connection.query(queryClause,function(err,rows,fields){
                                            connection.release();
                                            if(!err) {
                                            //response.json(rows);
                                            
                                            //res.json(rows[0]);
                                            numberRows=rows.length;
                                            
                                            console.log(numberRows);
                                            // console.log(fields.length);
                                            numberFields= fields.length;
                                            
                                            
                                            for (var i=0; i < numberFields; i ++)
                                            {
                                            
                                            nameOfFields[i]=fields[i].name;
                                            
                                            }
                                            for (var i = 0; i < numberRows;i++)
                                            {
                                            dataForShowing[i]=new Array(numberFields);
                                            dataForShowing[i][0]=(rows[i].VIN);
                                            dataForShowing[i][1]=(rows[i].VehicleID);
                                            dataForShowing[i][2]=(rows[i].UnitNumber);
                                            dataForShowing[i][3]=(rows[i].VehicleMake);
                                            dataForShowing[i][4]=(rows[i].VehicleModel);
                                            dataForShowing[i][5]=(rows[i].VehicleYear);
                                            
                                            }
                                            fs.readFile(template, function(err, data) {
                                                        
                                                        
                                                        
                                                        //var output = ejs.render(data.toString(), {title: title,numberRows:numberRowsE,numberFields:numberFieldsE,ContactID:ContactIDE,CompanyID:CompanyIDE,FirstName:FirstnameE,LastName:LastNameE, PhoneNumber:PhoneNumberE,EmailAddress:EmailAddressE,SiteAddress:SiteAddressE
                                                        //                SiteCity:SiteCityE, SIteState:SIteStateE,SiteZip:SiteZipE,ContactStatusID:ContactStatusIDE});
                                                        
                                                        
                                                        console.log('numberRows!!!!='+numberRows);
                                                        var output = ejs.render(data.toString(),{title:title, numberRowsE:numberRows,numberFieldsE: numberFields, dataForShowingE:dataForShowing, nameOfFieldsE : nameOfFields});
                                                        res.setHeader('Content-type', 'text/html');
                                                        res.end(output);
                                                        
                                                        
                                                        });
                                            }
                                            
                                            });
                           connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                           });
    }
    if (index ==3)// It's for Engine search
    {
        console.log('Engine');
        queryClause="Select * From Engine";

        pool.getConnection(function(err,connection){
                           if (err) {
                           connection.release();
                           response.json({"code" : 100, "status" : "Error in connection database"});
                           return;
                           }
                           var options = {sql: '...', nestTables: true};
                           console.log('connected as id ' + connection.threadId);
                           connection.query(queryClause,function(err,rows,fields){
                                            connection.release();
                                            if(!err) {
                                            
                                            //res.json(rows[0]);
                                            numberRows=rows.length;
                                            
                                            console.log(numberRows);
                                            // console.log(fields.length);
                                            numberFields= fields.length;
                                            
                                            for (var i=0; i < numberFields; i ++)
                                            {
                                            
                                            nameOfFields[i]=fields[i].name;
                                            
                                            }
                                            for (var i = 0; i < numberRows;i++)
                                            {
                                            dataForShowing[i]=new Array(numberFields);
                                            dataForShowing[i][0]=(rows[i].EngineVIN);
                                            dataForShowing[i][1]=(rows[i].EngineSerialNumber);
                                            dataForShowing[i][2]=(rows[i].EngineMake);
                                            dataForShowing[i][3]=(rows[i].EngineModel);
                                            dataForShowing[i][4]=(rows[i].EngineYear);
                                            
                                            
                                            }
                                            fs.readFile(template, function(err, data) {
                                                        
                                                        
                                                        
                                                        //var output = ejs.render(data.toString(), {title: title,numberRows:numberRowsE,numberFields:numberFieldsE,ContactID:ContactIDE,CompanyID:CompanyIDE,FirstName:FirstnameE,LastName:LastNameE, PhoneNumber:PhoneNumberE,EmailAddress:EmailAddressE,SiteAddress:SiteAddressE
                                                        //                SiteCity:SiteCityE, SIteState:SIteStateE,SiteZip:SiteZipE,ContactStatusID:ContactStatusIDE});
                                                        
                                                        
                                                        console.log('numberRows!!!!='+numberRows);
                                                        var output = ejs.render(data.toString(),{title:title, numberRowsE:numberRows,numberFieldsE: numberFields, dataForShowingE:dataForShowing, nameOfFieldsE : nameOfFields});
                                                        res.setHeader('Content-type', 'text/html');
                                                        res.end(output);
                                                        
                                                        
                                                        });
                                            }
                                            
                                            });
                           connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                           });
    }
    if (index ==4)// It's for Company search
    {
        console.log('Company');
        queryClause="Select * From Company";

        pool.getConnection(function(err,connection){
                           if (err) {
                           connection.release();
                           response.json({"code" : 100, "status" : "Error in connection database"});
                           return;
                           }
                           var options = {sql: '...', nestTables: true};
                           console.log('connected as id ' + connection.threadId);
                           connection.query(queryClause,function(err,rows,fields){
                                            connection.release();
                                            if(!err) {
                                            //response.json(rows);
                                            
                                           //res.json(rows[0]);
                                            numberRows=rows.length;
                                            
                                            console.log(numberRows);
                                            // console.log(fields.length);
                                            numberFields= fields.length;
                                            
                                            for (var i=0; i < numberFields; i ++)
                                            {
                                            
                                            nameOfFields[i]=fields[i].name;
                                            
                                            }
                                            for (var i = 0; i < numberRows;i++)
                                            {
                                            dataForShowing[i]=new Array(numberFields);
                                            dataForShowing[i][0]=(rows[i].CompanyID);
                                            dataForShowing[i][1]=(rows[i].CompanyName);
                                            dataForShowing[i][2]=(rows[i].BillingAddress);
                                            dataForShowing[i][3]=(rows[i].BillingCity);
                                            dataForShowing[i][4]=(rows[i].BillingState);
                                            dataForShowing[i][5]=(rows[i].BillingZip);
                                            dataForShowing[i][6]=(rows[i].BillingContactFirstName);
                                            dataForShowing[i][7]=(rows[i].BillingContactLastName);
                                            dataForShowing[i][8]=(rows[i].BillingContactEmail);
                                            dataForShowing[i][9]=(rows[i].BillingContactPhone);
                                            dataForShowing[i][10]=(rows[i].CompanyStatusID);
                                            }
                                            fs.readFile(template, function(err, data) {
                                                        
                                                        console.log('numberRows!!!!='+numberRows);
                                                        var output = ejs.render(data.toString(),{title:title, numberRowsE:numberRows,numberFieldsE: numberFields, dataForShowingE:dataForShowing, nameOfFieldsE : nameOfFields});
                                                        res.setHeader('Content-type', 'text/html');
                                                        res.end(output);
                                                        
                                                        
                                                        });
                                            }
                                            
                                            });
                           connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                           });
    }
    if (index ==5)// It's for DPFDOC search
    {
        console.log('DPFDOC');
        queryClause="Select * From DPFDOC";

        pool.getConnection(function(err,connection){
                           if (err) {
                           connection.release();
                           response.json({"code" : 100, "status" : "Error in connection database"});
                           return;
                           }
                           var options = {sql: '...', nestTables: true};
                           console.log('connected as id ' + connection.threadId);
                           connection.query(queryClause,function(err,rows,fields){
                                            connection.release();
                                            if(!err) {
                                            //response.json(rows);
                                            
                                            
                                            numberRows=rows.length;
                                            
                                            console.log(numberRows);
                                            // console.log(fields.length);
                                            numberFields= fields.length;
                                            
                                            for (var i=0; i < numberFields; i ++)
                                            {
                                            
                                            nameOfFields[i]=fields[i].name;
                                            
                                            }
                                            for (var i = 0; i < numberRows;i++)
                                            {
                                            dataForShowing[i]=new Array(numberFields);
                                            dataForShowing[i][0]=(rows[i].DPFID);
                                             dataForShowing[i][1]=(rows[i].TimesCleaned);
                                             dataForShowing[i][2]=(rows[i].PartNumber);
                                             dataForShowing[i][3]=(rows[i].SerialNumber);
                                             dataForShowing[i][4]=(rows[i].OtherNumber);
                                             dataForShowing[i][5]=(rows[i].Manufacturer);
                                             dataForShowing[i][6]=(rows[i].OuterDiameter);
                                             dataForShowing[i][7]=(rows[i].SubstrateDiameter);
                                             dataForShowing[i][8]=(rows[i].OuterLength);
                                             dataForShowing[i][9]=(rows[i].SubstrateLength);
                                             dataForShowing[i][10]=(rows[i].DPForDOC);
                                             dataForShowing[i][11]=(rows[i].TypeOfSubstrate);
                                            
                                            
                                            }
                                            fs.readFile(template, function(err, data) {
                                                        
                                                        
                                                        
                                                        //var output = ejs.render(data.toString(), {title: title,numberRows:numberRowsE,numberFields:numberFieldsE,ContactID:ContactIDE,CompanyID:CompanyIDE,FirstName:FirstnameE,LastName:LastNameE, PhoneNumber:PhoneNumberE,EmailAddress:EmailAddressE,SiteAddress:SiteAddressE
                                                        //                SiteCity:SiteCityE, SIteState:SIteStateE,SiteZip:SiteZipE,ContactStatusID:ContactStatusIDE});
                                                        
                                                        
                                                        console.log('numberRows!!!!='+numberRows);
                                                        var output = ejs.render(data.toString(),{title:title, numberRowsE:numberRows,numberFieldsE: numberFields, dataForShowingE:dataForShowing, nameOfFieldsE : nameOfFields});
                                                        res.setHeader('Content-type', 'text/html');
                                                        res.end(output);
                                                        
                                                        
                                                        });
                                            }
                                            
                                            });
                           connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                           });
    }
    
    

    
}
exports.showData=function(request,response)
{

var user = request.user;

    if(!request.isAuthenticated()|| user.username!="adminBob") {
        response.redirect('/login');
        console.log('not authed in userPage');
    }
    else{
    var index=request.params.id;
  

    /*
    var ContactID=[];
    var CompanyID=[];
    var FirstName=[];
    var LastName=[];
    var PhoneNumber=[];
    var EmailAddress=[];
    var SiteAddress=[];
    var SiteCity=[];
    var SIteState=[];
    var SiteZip=[];
    var ContactStatusID=[];
*/
    numberRows=1;
    getdata(request,response,index);
    
    
    /*fs.readFile(template, function(err, data) {
      
    

                //var output = ejs.render(data.toString(), {title: title,numberRows:numberRowsE,numberFields:numberFieldsE,ContactID:ContactIDE,CompanyID:CompanyIDE,FirstName:FirstnameE,LastName:LastNameE, PhoneNumber:PhoneNumberE,EmailAddress:EmailAddressE,SiteAddress:SiteAddressE
                        //                SiteCity:SiteCityE, SIteState:SIteStateE,SiteZip:SiteZipE,ContactStatusID:ContactStatusIDE});
                var start = new Date().getTime();
                for (var i = 0; i < 100000; i++) {
                if ((new Date().getTime() - start) > 1000){
                console.log('numberRows!!!!='+numberRows);
                var output = ejs.render(data.toString(),{title:title, numberRowsE:numberRows,numberFieldsE: numberFields, dataForShowingE:dataForShowing});
                response.setHeader('Content-type', 'text/html');
                response.end(output);
                break;
                }
                continue;
                }
    });*/
}
}


