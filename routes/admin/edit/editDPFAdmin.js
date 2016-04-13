var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Choose Existing Vehicle';

var path =require('path')
var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.show=function (req,res,app,dirpath)
{
    if(!req.isAuthenticated()) {
         app.set('views', path.join(dirPath, 'views'));
        res.redirect('/login?error=Time_out');
        
    } else {
        
        var user = req.user;
        if(user!=undefined){
            var keys = Object.keys(user);
            
            
            var val = user[keys[0]];
            var username=val.username;
            //  console.log(val.username);
            if(username=="adminBob"){

    //console.log('1111111');
    var ContactID= req.query.ContactID;
    var VIN =req.query.VIN;
    //console.log(VIN);
    var dataForShowing1=new Array();
    var CompanyID = req.query.CompanyID;
    //console.log(CompanyID+ " =  CompanyID");
    var DPFID= req.query.DPFID;
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                       
                        var queryClause2 = "Select DPFID as dpfid, PartNumber as pn, SerialNumber as sn, OtherNumber as onum, Manufacturer as mf, OuterDiameter as od,SubstrateDiameter as sd, OuterLength as ol, SubstrateLength as sl, DPForDOC as dorc, TypeOfSubstrate as ts , TimesCleaned as tc, CompanyID as ci From DPFDOC WHERE DPFID= " +connection.escape(DPFID);
                        //console.log(queryClause2);
                        connection.query(queryClause2,function(err,rows,fields){
                                         
                                         connection.release();
                                         if(!err)
                                         {
                                         if(rows[0]!=null&&rows[0].dpfid!=undefined){
                                         
                                         dataForShowing1=new Array(13);
                                         SerialNumber=rows[0].sn;
                                         DPFID=rows[0].dpfid;
                                         //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                         // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                         //console.log("");
                                         dataForShowing1[0]=rows[0].dpfid;
                                         
                                         dataForShowing1[1]=rows[0].pn;
                                         dataForShowing1[2]=rows[0].sn;
                                         dataForShowing1[3]=rows[0].onum;
                                         dataForShowing1[4]=rows[0].mf;
                                         dataForShowing1[5]=rows[0].od;
                                         dataForShowing1[6]=rows[0].sd;
                                         dataForShowing1[7]=rows[0].ol;
                                         dataForShowing1[8]=rows[0].sl;
                                         dataForShowing1[9]=rows[0].dorc;
                                         dataForShowing1[10]=rows[0].ts;
                                         dataForShowing1[11]=rows[0].tc;
                                          dataForShowing1[12]=rows[0].ci;
                                         
                                         if(req.query.message==undefined){
                                         res.render('editDPFAdmin', {h1:'Edit DPF',use:{username:'Administrator'},title:'Edit DPF',DPFID:DPFID,VIN:VIN,ContactID: ContactID,dataForShowingE:dataForShowing1,CompanyID:CompanyID});
                                         app.set('views', path.join(dirpath, 'views'));
                                         }else
                                         {
                                         res.render('editDPFAdmin', {h1:'Edit DPF',use:{username:'Administrator'},title:'Edit DPF',DPFID:DPFID,VIN:VIN,ContactID: ContactID,dataForShowingE:dataForShowing1,CompanyID:CompanyID,errorMessage:req.query.message});
                                         app.set('views', path.join(dirpath, 'views'));
                                         }

                                         
                                         }
                                         
                                         else{console.log("no DPFDOC records");
                                         //jump to add new DPF page.
                                         res.redirect('/addNewDPFAdmin?ContactID='+ContactID+'&VIN='+VIN+'&CompanyID='+CompanyID);
                                         app.set('views', path.join(dirpath, 'views'));
                                         }
                                         
                                         }
                                       
                                         
                                        
                                         
                                         
                                         else{
                                         console.log('error in Select DPF Info!');
                                         app.set('views', path.join(dirpath, 'views'));
                                         res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select DPF Infomation',title:"Error in Select DPFInfo",errorMessage :'Error in Select DPF Info!'});
                                         return;
                                         }

                                         
                                         });
                        });
            }
            else{
                 app.set('views', path.join(dirPath, 'views'));
                res.redirect('/userPage/'+username);
                
            }
        }
        
        
        
        
        else{
             app.set('views', path.join(dirPath, 'views'));
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

    var ContactID  = req.query.ContactID;
    var CompanyID= req.query.CompanyID;
    var VIN = req.query.VIN;
    var DPFID= req.query.DPFID;
    console.log('DPFID  '+DPFID);
    var newValue  ={};
    newValue["TimesCleaned"]= req.body.TimesCleaned;
    newValue["PartNumber"]= req.body.PartNumber;
    newValue["SerialNumber"]= req.body.SerialNumber;
    newValue["OtherNumber"]= req.body.OtherNumber;
    newValue["Manufacturer"]= req.body.Manufacturer;
    newValue["OuterDiameter"]= req.body.OuterDiameter;
    newValue["OuterLength"]= req.body.OuterLength;
    
    newValue["SubstrateDiameter"]= req.body.SubstrateDiameter;
    newValue["SubstrateLength"]= req.body.SubstrateLength;
        newValue["DPForDOC"]= req.body.DPForDOC;
        newValue["TypeOfSubstrate"]= req.body.TypeOfSubstrate;
        newValue["CompanyID"]= req.body.CompanyID_input;
    
    console.log(newValue);
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        //queryClause = "Select ContactID As Solution From user_Contact;";
                        queryClause="Update DPFDOC set ? Where DPFID = "+connection.escape(DPFID)+";";
                        connection.query(queryClause, newValue,function(err,rows){
                                         if(!err)
                                         {
                                         res.redirect('/editDPFAdmin?VIN='+VIN+'&CompanyID='+req.body.CompanyID_input+'&ContactID='+ContactID+'&message=Successful&DPFID='+DPFID);
                                         }
                                         else
                                         {
                                         console.log('error in Update DPF!');
                                         
                                         res.redirect('/editDPFAdmin?VIN='+VIN+'&CompanyID='+req.body.CompanyID_input+'&ContactID='+ContactID+'&message=Failed&DPFID='+DPFID);
                                         return;
                                         
                                         
                                         }
                                         
                                         
                                         });
                        connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                        });
    
    
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


