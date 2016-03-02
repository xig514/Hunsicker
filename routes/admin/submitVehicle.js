var mysql = require('mysql');
var ejs = require('ejs');



var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             
                             
                             });

exports.submitVehicle =function(req,res)
{
    var VehicleID = req.query.key;
    //  console.log('req.body'+JSON.stringify(req.body));
    // console.log('partnumber' +req.body.PartNumber);
    var input = {};
    //if it's a new vehicle, we find the largest vehicleId and plus 1
    input.VehicleMake = req.body.VehicleMake;
    input.VehicleModel = req.body.VehicleModel;
    input.UnitNumber = req.body.UnitNumber;
    input.VIN = req.body.VIN;
    input.VehicleYear = req.body.VehicleYear;
        // console.log(input);
    console.log(VehicleID);
    //var TimesCleaned=
    if(VehicleID=='newVehicle'){
           //if it's a new vehicle, we find the largest vehicleId and plus 1
        poolH.getConnection(function (err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            else{
                            query1 ="SELECT Max(VehicleID) FROM Hunsicker.Vehicle;";connection.query(query1, function(err,rows)
                                             {
                                             if(!err)
                                             {
                                             if(rows[0]==null )
                                             {
                                             VehicleID =1;
                                             input.VehicleID =VehicleID;
                                             }
                                             else
                                             {
                                            VehicleID= rows[0]+1;
                                            input.VehicleID = VehicleID;
                                             //then we make an insertion
                                             query2 = "Insert into Vehicle set?"
                                             connection.query(query2, input,function(err,rows){
                                                              if(!err)
                                                              {
                                                              var data ='SI';
                                                              res.end(data);
                                                              }
                                                              else{
                                                              console.log('Failed to Insert Vehicle');
                                                              var error ='FI';
                                                              res.end(error);
                                                              }
                                                              });
                                             }
                                             }
                                             else{
                                             console.log('error in finding Max VehicleID');
                                             var data='error in finding max VehicleID';
                                             res.end(data);
                                             }
                                             }
                                             );
                            
                            }
                            connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                            
                            });
        
    }
    else{
        //directly update.
        poolH.getConnection(function (err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            else{
                            console.log('VehicleID='+VehicleID);
                            query3= "Update Vehicle  Set ? WHERE VehicleID = "+connection.escape(VehicleID)+";";
                            connection.query(query3, input,function(err,rows){
                                             if(!err)
                                             {var data1= 'SU';
                                             console.log('Successfully to update Vehicle');
                                             res.json(data1);
                                             
                                             }
                                             else
                                             {
                                             console.log('Failed to update Vehicle');
                                             var error ='FU';
                                             res.end(error);
                                             }
                                             
                                             
                                             });
                            }
                            connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                            });
    }
    
}
