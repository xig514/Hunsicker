
var mysql     =    require('mysql');
var ejs = require ('ejs');

var title = 'Hi Bob';
var fs = require('fs');
var title  = 'Add New DPF Admin';





var CompanyID;
var ContactID;
var VIN;

var poolH     =    mysql.createPool({
                                    connectionLimit : 100, //important
                                    host     : 'localhost',
                                    user     : 'Xig514',
                                    password : 'some_pass',
                                    database : 'Hunsicker',
                                    debug    :  false
                                    });

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

    CompanyID=request.query.CompanyID;
    ContactID = request.query.ContactID;
    VIN = request.query.VIN;
    if(request.query.error!=undefined)
    {
        response.render('addNewDPFAdmin',{title:title,h1:title,username:'Bob' ,CompanyID:CompanyID,VIN:VIN,ContactID:ContactID,errorMessage:request.query.error});

    }
    else{
        response.render('addNewDPFAdmin',{title:title,h1:title,username:'Bob' ,CompanyID:CompanyID,VIN:VIN,ContactID:ContactID});
    }
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


exports.handle_Input=function(req,res) {
    
    
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
                
                

    CompanyID=req.query.CompanyID;
    ContactID = req.query.ContactID;
    VIN = req.query.VIN;
    var input = {};
    input.PartNumber = req.body.PartNumber;
    input.SerialNumber = req.body.SerialNumber;
    input.OtherNumber = req.body.OtherNumber;
    if(req.body.Manufacturer!=''){
        input.Manufacturer = req.body.Manufacturer;
    }
    if(req.body.OuterDiameter!=''){
        input.OuterDiameter = req.body.OuterDiameter;
    }
    if(req.body.SubstrateDiameter!=''){
        input.SubstrateDiameter = req.body.SubstrateDiameter;
    }
    if(req.body.OuterLength!=''){
        input.OuterLength = req.body.OuterLength;
    }
    if(req.body.SubstrateLength!=''){
        input.SubstrateLength = req.body.SubstrateLength;
    }
    ////we need to change the DPF type!!
    input.DPForDOC = req.body.DPForDOC;
    if(req.body.TypeOfSubstrate!=''){
        input.TypeOfSubstrate = req.body.TypeOfSubstrate;
    }
    
    input.TimesCleaned=0;
    //console.log(input);

    poolH.getConnection(function (err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        else{
                        
                        query0 = "SELECT TimesCleaned as tc, DPFID as di, CompanyID as ci From DPFDOC WHERE PartNumber= " +connection.escape(req.body.PartNumber)+" and  SerialNumber = "+connection.escape(req.body.SerialNumber)+"and OtherNumber = "+ connection.escape(req.body.OtherNumber)+";";
                        //console.log(query0);
                        connection.query(query0, function(err,rows){
                                         if(!err){
                                         if(rows[0]!=null &&rows[0].tc!=undefined&&rows.length==1)
                                         {
                                         //we found that DPF then, TimesCleaned+1, Link the Job with DPFID and return;
                                         if(rows[0].ci ==CompanyID){
                                         //So that's a duplicate, return to last page and ask the operator to update this Company.
                                         res.redirect('/addNewDPFAdmin?VIN='+VIN+'&ContactID='+ContactID+'&CompanyID='+CompanyID+'&error=This DPF is already in the database. You can update it by click edit DPF info button!');
                                         }
                                         else{
                                         res.redirect('/addNewDPFAdmin?VIN='+VIN+'&ContactID='+ContactID+'&CompanyID='+CompanyID+'&error=This DPF is already in the database but the CompanyID is different. If you want to change the CompanyID to current CompanyID, click edit DPF info button!');
                                         }
                                         
                                         }
                                         
                                         else
                                         {
                                         //we didn't found that DPF, this is completely a new one, we just insert it.
                                         
                                         
                                         var DPFID="";
                                         
                                         
                                         DPFID= 'H';
                                         
                                         switch(req.body.DPForDOC)
                                         {
                                         case 'DPF':
                                         DPFID+='F';
                                         break;
                                         case 'DOC':
                                         DPFID +='C';
                                         break;
                                         case 'SCR':
                                         DPFID +='S';
                                         break;
                                         }
                                         var d = new Date();
                                         var year =d.getFullYear().toString().substring(2,4);
                                         JobLocation="Fo";
                                         
                                         var DPFID_temp='%';
                                         
                                         DPFID+=year;
                                       
                                         
                                         
                                         DPFID+=JobLocation.substring(0,2);
                                         
                                         DPFID_temp=DPFID_temp+DPFID+'%';
                                         
                                         //console.log(DPFID_temp);
                                         query1 ="SELECT Max(DPFID) as dpfid FROM Hunsicker.DPFDOC where DPFID like "+ connection.escape(DPFID_temp)+";"
                                         //console.log(query1);
                                         connection.query(query1, function(err,rows)
                                                          {
                                                          if(!err)
                                                          {
                                                          if(rows[0]==null ||rows[0].dpfid==undefined )
                                                          {
                                                          DPFID +='001';
                                                          input.DPFID =DPFID;
                                                          }
                                                          else
                                                          {
                                                          //HF15FO123
                                                          var sN="";
                                                          var sequenceNumber = parseInt(rows[0].dpfid.toString().substring(6))+1;
                                                          
                                                          //console.log(sequenceNumber);
                                                          //console.log(rows[0]);
                                                          if(sequenceNumber<10)
                                                          {
                                                          sN= '00'+sequenceNumber.toString();
                                                          }
                                                          else if(sequenceNumber<100)
                                                          {
                                                          sN='0'+sequenceNumber.toString();
                                                          }
                                                          else{
                                                          sN= sequenceNumber.toString();
                                                          }
                                                          //console.log(sN);
                                                          input.DPFID = DPFID+sN;
                                                          }
                                                          input.TimesCleaned=0;
                                                          //console.log(input);
                                                          input.CompanyID=CompanyID;
                                                          console.log(input);
                                                          //then we make an insertion
                                                          query2 = "Insert into DPFDOC set ?";
                                                          connection.query(query2, input,function(err,rows){
                                                                           connection.release();
                                                                           if(!err)
                                                                           {
                                                                           console.log("choose");
                                                                           chooseDPF(req,res,VIN,ContactID,CompanyID,input.DPFID);
                                                                           }
                                                                           else{
                                                                           console.log('error in inserting DPF');
                                                                            res.redirect('/addNewDPFAdmin?VIN='+VIN+'&ContactID='+ContactID+'&CompanyID='+CompanyID+'&error=Error in inserting DPF');
                                                                           }});
                                                          
                                                          }
                                                          
                                                          else{
                                                          console.log('error in finding Max DPFID');
                                                          res.redirect('/addNewDPFAdmin?VIN='+VIN+'&ContactID='+ContactID+'&CompanyID='+CompanyID+'&error=Error in finding max DPFID');
                                                          }
                                                          });
                                                          
                                         
                                         }
                                         }
                                         
                                         else{
                                         //error
                                         console.log('error in finding TimesCleaned By three number!');
                                         res.redirect('/addNewDPFAdmin?VIN='+VIN+'&ContactID='+ContactID+'&CompanyID='+CompanyID+'&error=Error in finding specific DPF');
                                         }
                                         });
                        
                        }
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


function chooseDPF(req,res,VIN ,ContactID, CompanyID,selectedDPFID){
    
    var dataForShowing1=new Array();
    
    console.log(CompanyID+ " =  CompanyID");
    
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        var countDPF=0;
                        var queryClause2 = "Select x.count as countDPF , DPFID as dpfid, PartNumber as pn, SerialNumber as sn, OtherNumber as onum, Manufacturer as mf, OuterDiameter as od,SubstrateDiameter as sd, OuterLength as ol, SubstrateLength as sl, DPForDOC as dorc, TypeOfSubstrate as ts , TimesCleaned as tc From DPFDOC , (select count(*) as count FROM DPFDOC where CompanyID ="+connection.escape(CompanyID)+" ) as x   WHERE CompanyID ="+connection.escape(CompanyID) +"Order by DPFID ";
                        console.log(queryClause2);
                        connection.query(queryClause2,function(err,rows,fields){
                                         
                                         connection.release();
                                         if(!err)
                                         {
                                         if(rows[0]!=null&&rows[0].countDPF!=undefined){
                                         countDPF = rows[0].countDPF;
                                         DPFID = new Array(countDPF);
                                         SerialNumber = new Array(countDPF);
                                         for(var i =0; i <countDPF ; i++)
                                         {
                                         if (rows[i]!=null && rows[i].dpfid!= undefined)
                                         {
                                         
                                         
                                         dataForShowing1[i]=new Array(12);
                                         SerialNumber[i]=rows[i].sn;
                                         DPFID[i]=rows[i].dpfid;
                                         //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                         // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                         //console.log("");
                                         dataForShowing1[i][0]=rows[i].dpfid;
                                         
                                         dataForShowing1[i][1]=rows[i].pn;
                                         dataForShowing1[i][2]=rows[i].sn;
                                         dataForShowing1[i][3]=rows[i].onum;
                                         dataForShowing1[i][4]=rows[i].mf;
                                         dataForShowing1[i][5]=rows[i].od;
                                         dataForShowing1[i][6]=rows[i].sd;
                                         dataForShowing1[i][7]=rows[i].ol;
                                         dataForShowing1[i][8]=rows[i].sl;
                                         dataForShowing1[i][9]=rows[i].dorc;
                                         dataForShowing1[i][10]=rows[i].ts;
                                         dataForShowing1[i][11]=rows[i].tc;
                                         
                                         
                                         }
                                         
                                         else{
                                         console.log("no DPFDOC records");
                                         //jump to add new DPF page.
                                         res.redirect('/addNewDPFAdmin?ContactID='+ContactID+'&VIN='+VIN+'&CompanyID='+CompanyID);
                                         
                                         }
                                         
                                         }
                                         // console.log('CompanyCount = ' + countCompanyID);
                                         //;console.log(CompanyID);
                                         res.render('chooseExistingDPF', {h1:'Select DPF',use:{username:'Administrator'},title:'The result of all DPF',DPFCount:countDPF,DPFID:DPFID,VIN:VIN,ContactID: ContactID,dataForShowingE:dataForShowing1,CompanyID:CompanyID,selectedDPFID:selectedDPFID});
                                         }
                                         else{
                                         //Jump tp add new DPF because there is no vehicle records here.
                                         res.redirect('/addNewDPFAdmin?ContactID='+ContactID+'&VIN='+VIN+'&CompanyID='+CompanyID);
                                         
                                         }
                                         }
                                         
                                         else{
                                         console.log('error in Select DPF Info!');
                                         
                                         res.render('errorPage', {usernameE: 'administrator',h1:'Error in Select DPF Infomation',title:"Error in Select DPFInfo",errorMessage :'Error in Select DPF Info!'});
                                         return;
                                         }
                                         
                                         
                                         
                                         
                                         
                                         
                                         
                                         });
                        });
    
}



