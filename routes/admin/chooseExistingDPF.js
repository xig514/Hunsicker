var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Choose Existing Vehicle';


var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.show=function (request,response)
{
    //console.log(11111);
    response.writeHead(301,
                       {Location: 'http://localhost:9000/inputSelection'}
                       );
    response.end();
    //response.redirect('http:/localhost:9000/inputSelection');
}


exports.handle_Input=function (req,res)
{
    //console.log('1111111');
    var ContactID= req.query.ContactID;
    var VIN =req.query.VIN;
    //console.log(VIN);
    var dataForShowing1=new Array();
    var CompanyID = req.query.CompanyID;
    //console.log(CompanyID+ " =  CompanyID");
    
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            var countDPF=0;
                            var queryClause2 = "Select x.count as countDPF , DPFID as dpfid, PartNumber as pn, SerialNumber as sn, OtherNumber as onum, Manufacturer as mf, OuterDiameter as od,SubstrateDiameter as sd, OuterLength as ol, SubstrateLength as sl, DPForDOC as dorc, TypeOfSubstrate as ts , TimesCleaned as tc From DPFDOC , (select count(*) as count FROM DPFDOC where CompanyID ="+connection.escape(CompanyID)+" ) as x   WHERE CompanyID ="+connection.escape(CompanyID) +"Order by DPFID ";
                            //console.log(queryClause2);
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
                                             
                                             else{console.log("no DPFDOC records");
                                             //jump to add new DPF page.
                                             res.redirect('http://localhost:9000/addNewDPFAdmin?ContactID='+ContactID+'&VIN='+VIN+'&CompanyID='+CompanyID);
                                             
                                             }
                                             
                                             }
                                            // console.log('CompanyCount = ' + countCompanyID);
                                             //;console.log(CompanyID);
                                             res.render('chooseExistingDPF', {h1:'Select DPF',use:{username:'Administrator'},title:'The result of all DPF',DPFCount:countDPF,DPFID:DPFID,VIN:VIN,ContactID: ContactID,dataForShowingE:dataForShowing1,CompanyID:CompanyID});
                                             }
                                             else{
                                             //Jump tp add new DPF because there is no vehicle records here.
                                             res.redirect('http://localhost:9000/addNewDPFAdmin?ContactID='+ContactID+'&VIN='+VIN+'&CompanyID='+CompanyID);

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