
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
var JobID = ""
var datetime = new Date();
var month ="";
if (datetime.getMonth()<9)
{
    month = "0"+(datetime.getMonth()+1).toString();
    
}else {month =(datetime.getMonth()+1).toString();}

var today = datetime.getFullYear()+"-"+month+"-"+datetime.getDate();



exports.handle_selectByID=function(request,response) {
    
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
                                        response.redirect('selectByIDResult/'+JobID);
                                        }
                                                          
                                        else{
                                        //no result;
                                        response.render('selectByID',{title:'Select By JobID', Today: today,errorMessage: 'No records for this JobID!'});
                                        }
                                        
                                        }
                                        else
                                        response.render('selectByID',{title:'Select By JobID',Today:today, errorMessage: err.code});
                                        });
                       
                       connection.on('error', function(err) {      
                                     response.json({"code" : 100, "status" : "Error in connection database"});
                                     return;     
                                     });
                       });
}
exports.show=function(request,response)
{
    response.render('selectByID', {title:'Select By JobID', Today:today});

    
}


