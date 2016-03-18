
var mysql     =    require('mysql');
var ejs = require ('ejs');

var fs = require('fs');



var poolH     =    mysql.createPool({
                                    connectionLimit : 100, //important
                                    host     : 'localhost',
                                    user     : 'Xig514',
                                    password : 'some_pass',
                                    database : 'Hunsicker',
                                    debug    :  false
                                    });
var dataForShowing = new Array();



exports.handle_selectByNPVD=function(request,response) {
    
    var FirstName = request.body.FirstName;
    var LastName = request.body.LastName;
    var Phone = request.body.Phone;
    var VIN = request.body.VIN;
    var Date    = request.body.Date;
    
    console.log("Name"+FirstName+" "+LastName);
    console.log("Phone"+Phone);
    console.log("VIN"+VIN);
    console.log("date"+Date);
    
    var numberOfRows=0;
    var numberFields =0;
    poolH.getConnection(function(err,connection){
                       if (err) {
                       connection.release();
                       response.json({"code" : 100, "status" : "Error in connection database"});
                       return;
                       }
                       
                       
                       // var queryContactID= "SELECT ContactID FROM Contact WHERE FirstName Like \"%"+connection.escape(FirstName)+"%\""+"And LastName Like\"%"+(LastName)+"%\""+"And PhoneNumber =\"" +connection.escape(Phone)+"\";";
                        var queryContactID= "SELECT ContactID FROM Contact WHERE FirstName Like ? And LastName Like ? And PhoneNumber =" +connection.escape(Phone)+";";
                        console.log(queryContactID);
                        var a = "%"+(FirstName)+"%";
                        var b = "%"+LastName+"%";
                        connection.query(queryContactID,[a,b],function(err,rows,fields){
                                         if(!err) {
                                         
                                         numberOfRows = rows.length;
                                         console.log(numberOfRows);
                                         if(numberOfRows!=0){
                                         var queryJobID="Select * From Job where Job.ContactID = ";
                                         for (var i = 0; i < numberOfRows;i++)
                                         {
                                         if(i==0)
                                         queryJobID +=connection.escape(rows[i].ContactID);
                                         else
                                         queryJobID +=" or Job.ContactID = "+connection.escape(rows[i].ContactID);
                                         }
                                         queryJobID+=";"
                                         
                                         console.log(queryJobID);
                                         connection.query(queryJobID,function(err,rows,fields){
                                                          connection.release();
                                                          if(!err) {
                                                          
                                                          numberOfRows = rows.length;
                                                          //then we show all the information for this job
                                                          console.log(numberOfRows);
                                                          console.log(fields.length);
                                                          numberFields= fields.length;
                                                          if(numberOfRows!=0){
                                                          for (var i = 0; i < numberOfRows;i++)
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
                                                          response.render('selectByNPVDResult',{title:'Select By NPVD Result',dataForShowingE:dataForShowing,numberRowsE:numberOfRows,numberFieldsE:numberFields,h1:'Select By NPVD Result'});
                                                          }
                                                          
                                                          else{
                                                          //no result;
                                                          response.render('selectByNPVD', {title:'Select By Name, Phone in Contact part', errorMessage: 'No records for this Contact!'});
                                                          }
                                                          }
                                                          else
                                                          response.render('selectByNPVD', {title:'Select By Name, Phone in Contact part', errorMessage: err.code});
                                                          
                                                          });

                                         
                                         
                                         
                                         
                                         
                                         
                                         }
                                         else{
                                          response.render('selectByNPVD', {title:'Select By Name, Phone', errorMessage: 'No records for this Combination!'});
                                         return;
                                         }
                                         }
                                         else{
                                         response.render('selectByNPVD', {title:'Select By Name, Phone', errorMessage: err.code});

                                         }
                                                                });
                       connection.on('error', function(err) {      
                                     response.json({"code" : 100, "status" : "Error in connection database"});
                                     return;     
                                     });
                       });
}
exports.show=function(request,response)
{
    response.render('selectByNPVD', {title:'Select By Name, Phone'});
    
    
}


