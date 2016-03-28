var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Administrator Choose Existing Contact Based On Company ID';


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

    var CompanyID = req.params.id;
    //console.log(CompanyID);
    var CompanyName =req.query.CompanyName;
    console.log('original CompanyName' +CompanyName);
    var selectedContactID=req.query.selectedContactID;
    
    var dataForShowing1=new Array();
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        var countContactID=0;
                        var ContactID;
                        var ContactName;
                        var queryClause2 = "Select x.countt as countContactID,ContactID as ci, FirstName as fn, LastName as ln, PhoneNumber as pn, EmailAddress as ea, SiteAddress as sa, SiteCity as sc, SiteState as ss,SiteZip as sz, ContactStatusID as csid From Contact,(select count(*) as countt FROM Contact WHERE Contact.CompanyID = "+connection.escape(CompanyID)+") as x  WHERE Contact.CompanyID = " + connection.escape(CompanyID)+"Order By Contact.FirstName, Contact.LastName;";
                        // console.log(queryClause2);
                        connection.query(queryClause2,function(err,rows,fields){
                                         
                                         connection.release();
                                         if(!err)
                                         {
                                         if(rows[0]!=null && rows[0].countContactID !=undefined){
                                         
                                         
                                         countContactID = rows[0].countContactID;
                                         ContactID = new Array(countContactID);
                                         ContactName = new Array(countContactID);
                                         for(var i =0; i <countContactID ; i++)
                                         {
                                         if (rows[i]!=null && rows[i].ci!= undefined)
                                         {
                                         
                                         
                                         dataForShowing1[i]=new Array(12);
                                         ContactID[i]=rows[i].ci;
                                         ContactName[i]=rows[i].fn +" " + rows[i].ln;
                                         dataForShowing1[i][0]=rows[i].ci;
                                         
                                         dataForShowing1[i][1]=rows[i].fn;
                                         dataForShowing1[i][2]=rows[i].ln;
                                         dataForShowing1[i][3]=rows[i].pn;
                                         dataForShowing1[i][4]=rows[i].ea;
                                         dataForShowing1[i][5]=rows[i].sa;
                                         dataForShowing1[i][6]=rows[i].ss;
                                         
                                         dataForShowing1[i][7]=rows[i].sc;
                                         dataForShowing1[i][8]=rows[i].sz;
                                         dataForShowing1[i][9]=rows[i].csid;
                                         dataForShowing1[i][10] = CompanyID;
                                         
                                         dataForShowing1[i][11]=CompanyName;
                                         console.log(CompanyName);
                                         }
                                         }
                                         if(selectedContactID!=undefined){
                                         res.render('chooseExistingContactBasedOnCompanyIDadmin', {h1:'Select Contact',use:{username:'Administrator'},title:'The result of all Contacts based on the selected companyID ',CompanyName:CompanyName, CompanyID: CompanyID, ContactCount:countContactID,ContactID:ContactID,ContactName:ContactName,dataForShowingE:dataForShowing1,selectedContactID :selectedContactID });
                                         }
                                         else{
                                         res.render('chooseExistingContactBasedOnCompanyIDadmin', {h1:'Select Contact',use:{username:'Administrator'},title:'The result of all Contacts based on the selected companyID ',CompanyName:CompanyName, CompanyID: CompanyID, ContactCount:countContactID,ContactID:ContactID,ContactName:ContactName,dataForShowingE:dataForShowing1});
                                         }
                                         }
                                         
                                         else{
                                         console.log("no contact records");
                                         //Here go direct to add new Contact for this company pape.
                                         res.render('addNewContactAdmin',{title:'Add New Contact Admin',CompanyName:CompanyName,CompanyID:CompanyID,errorMessage:'Error in re-query Contacts'});
                                         }
                                         
                                         }
                                         
                                         else{
                                         console.log('error in Select Contact Info!');
                                         
                                         res.render('errorPage', {usernameE: 'Administrator',h1:'Error in Select Contact Infomation',title:"Error in Select ComapnyInfo",errorMessage :'Error in Select Contact Info!'});
                                         return;
                                         }
                                         
                                         
                                         
                                         
                                         
                                         
                                         });
                        });

    
 }


exports.handle_CompanyInput=function (req,res)
{
    var CompanyID = req.params.id;
    //console.log(CompanyID);
    var CompanyName =req.query.CompanyName;
    console.log('original CompanyName' +CompanyName);
    var dataForShowing1=new Array();
    
    
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            var countContactID=0;
                            var ContactID;
                            var ContactName;
                            var queryClause2 = "Select x.countt as countContactID,ContactID as ci, FirstName as fn, LastName as ln, PhoneNumber as pn, EmailAddress as ea, SiteAddress as sa, SiteCity as sc, SiteState as ss,SiteZip as sz, ContactStatusID as csid From Contact,(select count(*) as countt FROM Contact WHERE Contact.CompanyID = "+connection.escape(CompanyID)+") as x  WHERE Contact.CompanyID = " + connection.escape(CompanyID)+"Order By Contact.FirstName, Contact.LastName;";
                           // console.log(queryClause2);
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                             if(rows[0]!=null && rows[0].countContactID !=undefined){
                                             
                                             
                                             countContactID = rows[0].countContactID;
                                             ContactID = new Array(countContactID);
                                             ContactName = new Array(countContactID);
                                             for(var i =0; i <countContactID ; i++)
                                             {
                                             if (rows[i]!=null && rows[i].ci!= undefined)
                                             {
                                             
                                             
                                             dataForShowing1[i]=new Array(12);
                                             ContactID[i]=rows[i].ci;
                                             ContactName[i]=rows[i].fn +" " + rows[i].ln;
                                             dataForShowing1[i][0]=rows[i].ci;
                                             
                                             dataForShowing1[i][1]=rows[i].fn;
                                             dataForShowing1[i][2]=rows[i].ln;
                                             dataForShowing1[i][3]=rows[i].pn;
                                             dataForShowing1[i][4]=rows[i].ea;
                                             dataForShowing1[i][5]=rows[i].sa;
                                             dataForShowing1[i][6]=rows[i].ss;

                                             dataForShowing1[i][7]=rows[i].sc;
                                             dataForShowing1[i][8]=rows[i].sz;
                                             dataForShowing1[i][9]=rows[i].csid;
                                             dataForShowing1[i][10] = CompanyID;
                                             
                                             dataForShowing1[i][11]=CompanyName;
                                             //console.log(CompanyName);
                                             }
                                             }
                                             res.render('chooseExistingContactBasedOnCompanyIDadmin', {h1:'Select Contact',use:{username:'Administrator'},title:'The result of all Contacts based on the selected companyID ',CompanyName:CompanyName, CompanyID: CompanyID, ContactCount:countContactID,ContactID:ContactID,ContactName:ContactName,dataForShowingE:dataForShowing1});
                                             }

                                             
                                             else{
                                             console.log("no contact records");
                                             //Here go direct to add new Contact for this company pape.
                                             res.render('addNewContactAdmin',{title:'Add New Contact Admin',CompanyName:CompanyName,CompanyID:CompanyID});
                                             }
                                             
                                             }
                                          
                                                                                        else{
                                             console.log('error in Select Contact Info!');
                                             
                                             res.render('errorPage', {usernameE: 'Administrator',h1:'Error in Select Contact Infomation',title:"Error in Select ComapnyInfo",errorMessage :'Error in Select Contact Info!'});
                                             return;
                                             }

                                             
                                             

                            
                            
                                             });
                            });

}
