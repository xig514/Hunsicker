
var mysql     =    require('mysql');
var ejs = require ('ejs');

var title = 'Hi Bob';
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
var JobID = "";
var datetime = new Date();
var month ="";
if (datetime.getMonth()<9)
{
    month = "0"+(datetime.getMonth()+1).toString();
    
}else {month =(datetime.getMonth()+1).toString();}

var today = datetime.getFullYear()+"-"+month+"-"+datetime.getDate();


var ContactID =0;
var WorkOrderNumber="";
var PurchaseOrderNumber ="";
var StartTime ="";
var EndTime = "";
var VIN = "";

var VehicleTotalMileage=0;
var VehicleTotalHours = 0;
var DPFID = "";
var ReasonForCleaning="";
var TypeOFDriving="";
var OldJobID = "";
var JobLocation="";


exports.handle_selectByIDResult=function(request,response) {
    
    JobID = request.body.JobID;
    console.log(JobID)
    
    
    poolH.getConnection(function(err,connection){
                       if (err) {
                       connection.release();
                       response.json({"code" : 100, "status" : "Error in connection database"});
                       return;
                       }
                       
                       
                        queryJobID= "Select * from Job where JobID = "+ connection.escape(JobID)+";";
                        connection.query(queryJobID,function(err,rows){
                                        connection.release();
                                        if(!err) {
                                        
                                        if (rows[0]!=null)
                                        {
                                        //then we show all the information for this job
                                        ContactID=rows[0].ContactID;
                                        WorkOrderNumber=rows[0].WorkOrderNumber;
                                        PurchaseOrderNumber=rows[0].PurchaseOrderNumber;
                                        StartTime=rows[0].StartTime;
                                        EndTime=rows[0].EndTime;
                                        
                                        VIN=rows[0].VIN;
                                        VehicleTotalHours=rows[0].VehicleTotalHours;
                                        VehicleTotalMileage=rows[0].VehicleTotalMileage;
                                        DPFID=rows[0].DPFID;
                                        ReasonForCleaning=rows[0].ReasonForCleaning;
                                        TypeOFDriving=rows[0].TypeOFDriving;
                                        OldJobID=rows[0].OldJobID;
                                        JobLocation=rows[0].JobLocation;
                                        
                                        
                                        response.render('selectByIDResult',{title:'Select By ID Result',JobID:JobID, Today:today, ContactID:ContactID,WorkOrderNumber:WorkOrderNumber, PurchaseOrderNumber:PurchaseOrderNumber,StartTime:StartTime,EndTime:EndTime,VIN:VIN,  VehicleTotalMileage:VehicleTotalMileage,VehicleTotalHours:VehicleTotalHours, DPFID:DPFID, ReasonForCleaning:ReasonForCleaning,TypeOFDriving:TypeOFDriving,OldJobID:OldJobID,JobLocation:JobLocation});
                                        }
                                        else{
                                        //no result;
                                        response.render('selectByID',{title:'Select By JobID', Today:today, errorMessage:'No result for this JobID!'});
                                        }
                                        
                                        }
                                        else  response.render('selectByID',{title:'Select By JobID',Today:today, errorMessage: err.code});
                                        });
                       
                       connection.on('error', function(err) {      
                                     response.json({"code" : 100, "status" : "Error in connection database"});
                                     return;     
                                     });
                       });
}

exports.show=function(request,response)
{
    
    JobID = request.params.JobID;
    console.log(JobID)

    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        response.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        
                        
                        queryJobID= "Select * from Job where JobID = "+ connection.escape(JobID)+";";
                        connection.query(queryJobID,function(err,rows){
                                         connection.release();
                                         if(!err) {
                                         
                                         if (rows[0]!=null)
                                         {
                                         //then we show all the information for this job
                                         ContactID=rows[0].ContactID;
                                         WorkOrderNumber=rows[0].WorkOrderNumber;
                                         PurchaseOrderNumber=rows[0].PurchaseOrderNumber;
                                         StartTime=rows[0].StartTime;
                                         EndTime=rows[0].EndTime;
                                         
                                         VIN=rows[0].VIN;
                                         VehicleTotalHours=rows[0].VehicleTotalHours;
                                         VehicleTotalMileage=rows[0].VehicleTotalMileage;
                                         DPFID=rows[0].DPFID;
                                         ReasonForCleaning=rows[0].ReasonForCleaning;
                                         TypeOFDriving=rows[0].TypeOFDriving;
                                         OldJobID=rows[0].OldJobID;
                                         JobLocation=rows[0].JobLocation;
                                         
                                         
                                         response.render('selectByIDResult',{title:'Select By ID Result',JobID:JobID, Today:today, ContactID:ContactID,WorkOrderNumber:WorkOrderNumber, PurchaseOrderNumber:PurchaseOrderNumber,StartTime:StartTime,EndTime:EndTime,VIN:VIN,  VehicleTotalMileage:VehicleTotalMileage,VehicleTotalHours:VehicleTotalHours, DPFID:DPFID, ReasonForCleaning:ReasonForCleaning,TypeOFDriving:TypeOFDriving,OldJobID:OldJobID,JobLocation:JobLocation});
                                         }
                                         else{
                                         //no result;
                                         response.render('errorPage',{title:'Select By JobID Result', h1:'Select By JobID Result', errorMessage:'No result for this JobID!', username:'adminBob'});
                                         }
                                         
                                         }
                                         else    response.render('errorPage',{title:'Select By JobID Result', h1:'Select By JobID Result',username:'adminBob', errorMessage: err.code});
                                         });
                        
                        connection.on('error', function(err) {
                                      response.json({"code" : 100, "status" : "Error in connection database"});
                                      return;
                                      });
                        });


    
}


