var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Administrator Add New Job';

var path = require('path');

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
    var CompanyID=req.params.id;
    var newValue  ={};
    newValue['CompanyName']=req.body.CompanyName;
    newValue['BillingAddress']=req.body.Address;
    newValue['BillingCity']=req.body.City;
    newValue['BillingState']=req.body.State;
    newValue['BillingZip']=req.body.Zip;
    newValue['BillingContactFirstName']=req.body.BillingContactFirstName;
    newValue['BillingContactLastName']=req.body.BillingContactLastName;
    newValue['BillingContactEmail']=req.body.BillingContactEmail;
    newValue['BillingContactPhone']=req.body.BillingContactPhone1+req.body.BillingContactPhone2+req.body.BillingContactPhone3;
    if( req.body.CompanyStatusID=='Yes')
        newValue['CompanyStatusID'] =1;
    else
        newValue['CompanyStatusID'] =0;
    console.log(newValue);
    
   
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        //queryClause = "Select ContactID As Solution From user_Contact;";
                        queryClause="Update Company set ? Where CompanyID = "+connection.escape(CompanyID)+";";
                        connection.query(queryClause, newValue,function(err,rows){
                                         connection.release();
                                         if(!err)
                                         {
                                         res.redirect('/editCompanyAdmin/'+CompanyID+'?message=Successful');
                                         }
                                         else
                                         {
                                         console.log('error in Update Company!');
                                         
                                         res.redirect('/editCompanyAdmin/'+CompanyID+'?message=Failed');
                                         return;
                                         
                                         
                                         }
                                         
                                         
                                         });
                        connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                        });
    
}





exports.show=function (req,res,app,dirPath)
{
    var dataForShowing1=new Array(12);
    var CompanyID = req.params.id;
            poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            
                            
                           
                            var queryClause2 = "Select CompanyID as ci, CompanyName as cn, BillingAddress as ba, BillingCity as bc, BillingState as bs, BillingZip as bz, BillingContactFirstName as bcfn, BillingContactLastName as bcln,BillingContactEmail as bce, BillingContactPhone as bcp, CompanyStatusID as csid From Company WHERE CompanyID= "+connection.escape(CompanyID);
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                            
                                             var CompanyName = "";
                                             
                                             if (rows[0]!=null && rows[0].cn!= undefined)
                                             {
                                             
                                             
                                            
                                             
                                             CompanyName=rows[0].cn;
                                             //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                            // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                             //console.log("");
                                             dataForShowing1[0]=rows[0].cn;
                                             
                                             dataForShowing1[1]=rows[0].ci;
                                             dataForShowing1[2]=rows[0].ba;
                                             dataForShowing1[3]=rows[0].bc;
                                             dataForShowing1[4]=rows[0].bs;
                                             dataForShowing1[5]=rows[0].bz;
                                             dataForShowing1[6]=rows[0].bcfn;
                                             dataForShowing1[7]=rows[0].bcln;
                                             dataForShowing1[8]=rows[0].bce;
                                             dataForShowing1[9] = rows[0].bcp;
                                             dataForShowing1[10] = rows[0].csid;
                                             
                                             }
                                             
                                             else{console.log("no company records");
                                             
                                             
                                             }
                                             
                                             
                                            // console.log('CompanyCount = ' + countCompanyID);
                                             //;console.log(CompanyID);
                                             if(req.query.message!=undefined){
                                             res.render('editCompanyAdmin', {h1:'Edit Company',use:{username:'Administrator'},title:'The result of this Company',CompanyID:CompanyID,CompanyName:CompanyName,dataForShowingE:dataForShowing1,errorMessage:req.query.message});
                                             app.set('views', path.join(dirPath, 'views'));

                                             }
                                             else{
                                             res.render('editCompanyAdmin', {h1:'Edit Company',use:{username:'Administrator'},title:'The result of this Company',CompanyID:CompanyID,CompanyName:CompanyName,dataForShowingE:dataForShowing1});
                                             app.set('views', path.join(dirPath, 'views'));

                                             }
                                             
                                             
                                             }
                                             else{
                                             console.log('error in Select CompanyInfo!');
                                             app.set('views', path.join(dirPath, 'views'));
                                             res.render('errorPage', {usernameE: username,h1:'Error in Select Company Infomation in edit',title:"Error in Select ComapnyInfo in edit",errorMessage :'Error in Edit CompanyInfo!'});
                                             return;
                                             }

                                             
                                             

                            
                            
                                             });
                                });
    

}

exports.deleteAdmin=function(req,res){
    var CompanyID= req.query.CompanyID;
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        
                        
                        
                        var queryClause2 = "Delete from Company Where CompanyID =" +connection.escape(CompanyID);
                        connection.query(queryClause2,function(err,rows,fields){
                                         
                                         connection.release();
                                         if(!err)
                                         {
                                         res.redirect('/chooseExistingCompany');
                                         
                                         }
                                         else{
                                         console.log('error in Delete CompanyInfo!');
                                         
                                         res.render('errorPage', {usernameE: username,h1:'Error in Delete Company Infomation in edit',title:"Error in Delete ComapnyInfo in edit",errorMessage :'Error in Delete CompanyInfo!'});
                                         return;
                                         }
                                         
                                         
                                         
                                         
                                         
                                         
                                         });
                        });

}
