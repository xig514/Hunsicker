var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Choose Existing Engine';


var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.show=function (req,res)
{
    var VIN1=req.query.VIN;
    var ContactID=req.query.ContactID;
    var selectedSerialNumber=req.query.SerialNumber;
    
    if(VIN1 !=null && VIN1!=undefined){
        var dataForShowing1=new Array();
        var CompanyID = req.query.CompanyID;
        console.log(VIN1+ " = VIN");
        var countEngine=0;
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            
                            
                            
                            var queryClause2 = "Select x.count as countEngine , EngineVIN as VIN, EngineSerialNumber as esn, EngineMake as em, EngineModel as emodel,  EngineYear as ey From Engine , (select count(*) as count FROM Engine Where EngineVIN =" + connection.escape(VIN1) +") as x where Engine.EngineVIN =" + connection.escape(VIN1) +" Order by VIN ";
                            //console.log(queryClause2);
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                             if(rows[0]!=null&&rows[0].countEngine!=undefined){
                                             countEngine = rows[0].countEngine;
                                             SerialNumber = new Array(countEngine);
                                             
                                             for(var i =0; i <countEngine ; i++)
                                             {
                                             if (rows[i]!=null && rows[i].VIN!= undefined)
                                             {
                                             
                                             
                                             dataForShowing1[i]=new Array(5);
                                             
                                             SerialNumber[i]=rows[i].esn;
                                             //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                             // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                             //console.log("");
                                             dataForShowing1[i][0]=rows[i].VIN;
                                             
                                             dataForShowing1[i][1]=rows[i].esn;
                                             dataForShowing1[i][2]=rows[i].em;
                                             dataForShowing1[i][3]=rows[i].emodel;
                                             dataForShowing1[i][4]=rows[i].ey;
                                             
                                             
                                             
                                             }
                                             
                                             else{console.log("no Vehicle records");
                                             
                                             
                                             }
                                             
                                             }
                                             // console.log('CompanyCount = ' + countCompanyID);
                                             //;console.log(CompanyID);
                                             res.render('chooseExistingEngineBasedOnVehicle', {h1:'Select Engine',use:{username:'Administrator'},title:'The result of all Engine Base On specific VIN',EngineCount:countEngine,VIN:VIN1,SerialNumber:SerialNumber,ContactID: ContactID, CompanyID:CompanyID,dataForShowingE:dataForShowing1,selectedSerialNumber:selectedSerialNumber});
                                             }
                                             else{
                                             //Jump tp add new ENgine because there is no Engine records here.
                                             res.redirect('/AddNewEngineAdmin/'+VIN+'?ContactID='+ContactID+'&CompanyID='+CompanyID);
                                             }
                                             }
                                             
                                             else{
                                             console.log('error in Select Engine Info!');
                                             
                                             res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select Engine Infomation',title:"Error in Select EngineInfo",errorMessage :'Error in Select Engine Info!'});
                                             return;
                                             }
                                             
                                             
                                             
                                             
                                             
                                             
                                             
                                             });
                            });
    }
    else{
        //go direct to page that need you to input a new Engine.
        res.redirect('/AddNewEngineAdmin/'+VIN+'?ContactID='+ContactID+'&CompanyID='+CompanyID);
        
    }

}


exports.handle_Input=function (req,res)
{
    //console.log('1111111');
    var ContactID= req.query.ContactID;
    var VIN =req.query.VIN;
    if(VIN !=null && VIN !=undefined){
    var dataForShowing1=new Array();
    var CompanyID = req.query.CompanyID;
    console.log(VIN+ " = VIN");
    var countEngine=0;
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                          
                            
                            
                            var queryClause2 = "Select x.count as countEngine , EngineVIN as VIN, EngineSerialNumber as esn, EngineMake as em, EngineModel as emodel,  EngineYear as ey From Engine , (select count(*) as count FROM Engine Where EngineVIN =" + connection.escape(VIN) +") as x where Engine.EngineVIN =" + connection.escape(VIN) +" Order by VIN ";
                            console.log(queryClause2);
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                             if(rows[0]!=null&&rows[0].countEngine!=undefined){
                                             countEngine = rows[0].countEngine;
                                             SerialNumber = new Array(countEngine);
                                             
                                             for(var i =0; i <countEngine ; i++)
                                             {
                                             if (rows[i]!=null && rows[i].VIN!= undefined)
                                             {
                                             
                                             
                                             dataForShowing1[i]=new Array(5);
                                             
                                             SerialNumber[i]=rows[i].esn;
                                             //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                            // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                             //console.log("");
                                             dataForShowing1[i][0]=rows[i].VIN;
                                             
                                             dataForShowing1[i][1]=rows[i].esn;
                                             dataForShowing1[i][2]=rows[i].em;
                                             dataForShowing1[i][3]=rows[i].emodel;
                                             dataForShowing1[i][4]=rows[i].ey;
                           

                                             
                                             }
                                             
                                             else{console.log("no Vehicle records");
                                             
                                             
                                             }
                                             
                                             }
                                            // console.log('CompanyCount = ' + countCompanyID);
                                             //;console.log(CompanyID);
                                             res.render('chooseExistingEngineBasedOnVehicle', {h1:'Select Engine',use:{username:'Administrator'},title:'The result of all Engine Base On specific VIN',EngineCount:countEngine,VIN:VIN,SerialNumber:SerialNumber,ContactID: ContactID, CompanyID:CompanyID,dataForShowingE:dataForShowing1,});
                                             }
                                             else{
                                             //Jump tp add new vehicle because there is no vehicle records here.
                                             res.redirect('/AddNewEngineAdmin/'+VIN+'?ContactID='+ContactID+'&CompanyID='+CompanyID);
                                             }
                                             }
                                             
                                             else{
                                             console.log('error in Select Engine Info!');
                                             
                                             res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select Engine Infomation',title:"Error in Select EngineInfo",errorMessage :'Error in Select Engine Info!'});
                                             return;
                                             }
                                             
                           
                                             
                                       

                            
                                             
                                             });
                            });
    }
    else{
        //go direct to page that need you to input a new Engine.
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
