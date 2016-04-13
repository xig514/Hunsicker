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
    
    if(!req.isAuthenticated()) {
        res.redirect('/login?error=Time_out');
        
    } else {
        
        var user = req.user;
        if(user!=undefined){
            var keys = Object.keys(user);
            
            
            var val = user[keys[0]];
            var username=val.username;
            //  console.log(val.username);
            if(username=="adminBob"){
                
                

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
            else{
                res.redirect('/userPage/'+username);
                
            }
        }
        
        
        
        
        else{
            console.log("undefined user");
            //logged in but user is undefined? Will that happen?
            res.redirect('/login');
        }
        
    }
    

}


exports.handle_Input=function (req,res)
{
    if(!req.isAuthenticated()) {
        res.redirect('/login?error=Time_out');
        
    } else {
        
        var user = req.user;
        if(user!=undefined){
            var keys = Object.keys(user);
            
            
            var val = user[keys[0]];
            var username=val.username;
            //  console.log(val.username);
            if(username=="adminBob"){
                
    
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
            else{
                res.redirect('/userPage/'+username);
                
            }
        }
        
        
        
        
        else{
            console.log("undefined user");
            //logged in but user is undefined? Will that happen?
            res.redirect('/login');
        }
        
    }
    
    
    

    
}

