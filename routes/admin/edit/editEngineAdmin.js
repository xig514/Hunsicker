var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Choose Existing Engine';
var path=require('path');

var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.handle_Input=function (req,res)
{
   var VIN =req.query.VIN;
    var ContactID =req.query.ContactID;
    var CompanyID=req.query.CompanyID;
    var newValue={};
    //console.log(VIN);
    newValue['EngineSerialNumber']=req.body.SerialNumber;
    newValue['EngineMake']=req.body.Make;
    newValue['EngineModel']=req.body.Model;
    newValue['EngineYear']=req.body.Year;

    //console.log(newValue);
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        //queryClause = "Select ContactID As Solution From user_Contact;";
                        queryClause="Update Engine set ? Where EngineVIN = "+connection.escape(VIN)+";";
                        connection.query(queryClause, newValue,function(err,rows){
                                         connection.release();
                                         if(!err)
                                         {
                                         res.redirect('/editEngineAdmin?VIN='+VIN+'&CompanyID='+req.body.CompanyID+'&ContactID='+ContactID+'&message=Successful');
                                         }
                                         else
                                         {
                                         console.log('error in Update Vehicle!');
                                    
                                         res.redirect('/editVehicleAdmin?VIN'+VIN+'&CompanyID='+req.body.CompanyID+'&ContactID='+ContactID+'&message=Failed');
                                         return;
                                         
                                         
                                         }
                                         
                                         
                                         });
                        connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                        });
    
    


}


exports.show=function (req,res,app,dirpath)
{
    //console.log('1111111');
    var ContactID= req.query.ContactID;
    var VIN =req.query.VIN;
    //console.log('VIN'+VIN);
    if(VIN !=null && VIN !=undefined){
    var dataForShowing1=new Array();
    var CompanyID = req.query.CompanyID;
    
  
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                          
                            
                            
                            var queryClause2 = "Select  EngineVIN as VIN, EngineSerialNumber as esn, EngineMake as em, EngineModel as emodel,  EngineYear as ey From Engine Where EngineVIN =  "+connection.escape(VIN);
                            //console.log(queryClause2);
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                             if(rows[0]!=null&&rows[0].esn!=undefined){


                                             
                                             dataForShowing1=new Array(5);
                                             
                                             SerialNumber=rows[0].esn;
                                             
                                             //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                            // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                             //console.log("");
                                             dataForShowing1[0]=rows[0].VIN;
                                             
                                             dataForShowing1[1]=rows[0].esn;
                                             dataForShowing1[2]=rows[0].em;
                                             dataForShowing1[3]=rows[0].emodel;
                                             dataForShowing1[4]=rows[0].ey;
                           
                                             var message=req.query.message;
                                             if(message!=undefined){
                                             res.render('editEngineAdmin', {h1:'Edit Engine',use:{username:'Administrator'},title:'Edit Engine Base On specific VIN',VIN:VIN,SerialNumber:SerialNumber,ContactID: ContactID, CompanyID:CompanyID,dataForShowingE:dataForShowing1,errorMessage:message});
                                             app.set('views', path.join(dirpath, 'views'));
                                             }
                                             else{
                                              res.render('editEngineAdmin', {h1:'Edit Engine',use:{username:'Administrator'},title:'Edit Engine Base On specific VIN',VIN:VIN,SerialNumber:SerialNumber,ContactID: ContactID, CompanyID:CompanyID,dataForShowingE:dataForShowing1});
                                             app.set('views', path.join(dirpath, 'views'));
                                             }
                                             }
                                             
                                             else{console.log("no Engine records");
                                             app.set('views', path.join(dirpath, 'views'));
                                                            res.redirect('/AddNewEngineAdmin/'+VIN+'?ContactID='+ContactID+'&CompanyID='+CompanyID);
                                             
                                             }
                                             

                                            }
                                             
                                             else{
                                             console.log('error in Select Engine Info!');
                                             app.set('views', path.join(dirpath, 'views'));
                                             res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select Engine Infomation',title:"Error in Select EngineInfo",errorMessage :'Error in Select Engine Info!'});
                                             return;
                                             }
                                             
  
                                             
                                             });
                            });
    }
    else{
        //go direct to page that need you to input a new Engine.
        app.set('views', path.join(dirpath, 'views'));
         res.redirect('/AddNewEngineAdmin/'+VIN+'?ContactID='+ContactID+'&CompanyID='+CompanyID);
        
    }
    
}

/*
 poolH.getConnection(function(err,connection){
 if (err) {
 connection.release();
 response.json({"code" : 100, "status" : "Error in connection database"});
 return;
 }
 //queryDPFID='Select DPFID from DPFDOC WHERE DPFID like "%'+req.query.key+'%;"'
 queryDPFID='SELECT DPFID from DPFDOC where DPFID like "%'+request.query.key+'%"'
 connection.query(queryDPFID,function(err,rows){
 connection.release();
 if(!err)
 {
 var data=[];
 for(i=0;i<rows.length;i++)
 {
 data.push(rows[i].DPFID);
 
 }
 console.log(data);
 response.end(JSON.stringify(data));
 
 }
 else
 {
 console.log('error in select dpfid');
 response.render('errorPage',{title:'Select DPFID ', h1:'Select DPFID', errorMessage:'ERROR IN DPF!', usernameE:'adminBob'});//???why
 }
 })
 });
 

*/
