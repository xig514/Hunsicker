
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



exports.handle_selectByUsername=function(request,response) {
    if(!request.isAuthenticated()) {
        response.redirect('/login?error=Time_out');
        
    } else {
        
        var user = request.user;
        if(user!=undefined){
            var keys = Object.keys(user);
            
            
            var val = user[keys[0]];
            var username=val.username;
            //  console.log(val.username);
            if(username=="adminBob"){
                

                
    var Username = request.body.Username;
    console.log(Username);
    var numberOfRows=0;
    var numberFields =0;
    poolH.getConnection(function(err,connection){
                       if (err) {
                       connection.release();
                       response.json({"code" : 100, "status" : "Error in connection database"});
                       return;
                       }
                       
                       
                        queryJobID= "SELECT * FROM Job join user_contact on Hunsicker.Job.ContactID = Hunsicker.user_Contact.ContactID WHERE username="+connection.escape(Username)+";";
                       connection.query(queryJobID,function(err,rows,fields){
                                        connection.release();
                                        if(!err) {
                                        
                                         numberOfRows = rows.length;
                                        //then we show all the information for this job
                                        console.log(numberOfRows);
                                        console.log(fields.length);
                                         numberFields= fields.length;
                                        if(numberOfRows!=0){
                                    /*    for (var i=0; i < numberFields-2; i ++)
                                        {
                                        
                                        nameOfFields[i]=fields[i].name;
                                        
                                        }
                                      */
                                        for (var i = 0; i < numberOfRows;i++)
                                        {
                                        
                                        dataForShowing[i]=new Array(numberFields-2);
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
                                        response.render('selectByUserNameResult',{title:'Select By Username Result',dataForShowingE:dataForShowing,numberRowsE:numberOfRows,numberFieldsE:numberFields-2,h1:'Select By Username Result'});
                                        }
                                        
                                        else{
                                        //no result;
                                        response.render('selectByUserName',{title:'Select By UserName', errorMessage: 'No records for this Username!'});
                                        }
                                        }
                                        else
                                        response.render('selectByUserName',{title:'Select By UserName', errorMessage: err.code});
                                        
                                        });
                       
                       connection.on('error', function(err) {      
                                     response.json({"code" : 100, "status" : "Error in connection database"});
                                     return;     
                                     });
                       });
            }
                else{
                    response.redirect('/userPage/'+username);
                    
                }
            }
            
            
            
            
            else{
                console.log("undefined user");
                //logged in but user is undefined? Will that happen?
                response.redirect('/login');
            }
            
        }
}
exports.show=function(request,response)
{
    
    if(!request.isAuthenticated()) {
        response.redirect('/login?error=Time_out');
        
    } else {
        
        var user = request.user;
        if(user!=undefined){
            var keys = Object.keys(user);
            
            
            var val = user[keys[0]];
            var username=val.username;
            //  console.log(val.username);
            if(username=="adminBob"){
                

    response.render('selectByUserName', {title:'Select By UserName'});
            }
            
            
            else{
                response.redirect('/userPage/'+username);
                
            }
        }
        
        
        
        
        else{
            console.log("undefined user");
            //logged in but user is undefined? Will that happen?
            response.redirect('/login');
        }
        
    }

    
}


