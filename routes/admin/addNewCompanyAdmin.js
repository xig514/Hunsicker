var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Administrator Add New Company';
var template = './views/addNewCompanyAdmin.ejs';

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

}

exports.handle_Input=function (request,response)
{
   var user = request.user;

    if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in userPage');
    }
    else{
    var CompanyName=request.body.CompanyName;
    //console.log(CompanyName);
    var BillingAddress = request.body.BillingAddress;
    var BillingCity = request.body.BillingCity;
    var BillingState = request.body.BillingState;
    var BillingZip =request.body.BillingZip;
    var BillingContactFirstName = request.body.BillingContactFirstName;
    var BillingContactLastName = request.body.BillingContactLastName;
    var BillingContactEmail = request.body.BillingContactEmail;
    var BillingContactPhone = request.body.BillingContactPhone1+ request.body.BillingContactPhone2+ request.body.BillingContactPhone3;
    var CompanyStatusID= request.body.CompanyStatusID;
     MaxCompanyID = 0;
    title = "Input into Company and Contact";
    
    
    if(CompanyStatusID=='Yes')
    {
        var CompanyStatusID =1;
        //console.log('checked');
    }
    else
    {
        CompanyStatusID = 0;
    }
    
    
    
    //console.log(BillingAddress);
    
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        
                        response.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        var options = {sql: '...', nestTables: true};
                        console.log('connected as id ' + connection.threadId);
                        
                        //First we need to Search if the company is in the database, if it is, then just input the Contact
                        
                        queryClause="Select CompanyID As solution From Company Where CompanyName  = " +connection.escape(CompanyName) + " And  BillingAddress = " +connection.escape(BillingAddress)+"And BillingContactPhone="+ connection.escape(BillingContactPhone)+" And BillingContactFirstName=" + connection.escape(BillingContactFirstName)+" And BillingContactLastName = "+ connection.escape(BillingContactLastName)+";";
                        
                        console.log(queryClause);
                        connection.query(queryClause,function(err,rows){
                                         
                                         if(!err ) {
                                         if (rows[0]!=null)//we found the record, I assume that only one CompanyID can be found
                                         {
                                         console.log("this company is already in the database");
                                         MaxCompanyID=rows[0].solution;
                                         //-----------------------------------------------------------------------------------------
                                         //After Inserting into the Company, we need to insert into the Contact
                                         
                                         //then just check the Contact info
                                         response.render('addNewCompanyAdmin',{title:title, errorMessage:"This company is already in the database!"})
                                         }
                                         
                                         else{//we didn't find the record,we should input it into the database
                                         var findLargestCompanyID = "Select Max(CompanyID) AS solution from Company;";
                                         
                                         connection.query(findLargestCompanyID,function(err,rows){//First, found the largest CompanyID;
                                                          
                                                          if(!err) {
                                                          if(rows[0]!=null)
                                                          {
                                                          console.log('maxID rows is :'+rows[0]);
                                                          MaxCompanyID= rows[0].solution+1;
                                                          console.log('Now the max CPID is :'+MaxCompanyID);
                                                          //--------------------------------------------------------------------------------------------------------------
                                                          
                                                          
                                                          var insert="INSERT INTO Company Set ? ";
                                                          var CompanyInput = {CompanyID: MaxCompanyID, CompanyName:CompanyName,BillingAddress:BillingAddress, BillingCity:BillingCity,BillingZip:BillingZip,BillingContactFirstName:BillingContactFirstName,BillingContactLastName:BillingContactLastName,BillingContactPhone:BillingContactPhone ,BillingContactEmail:BillingContactEmail,CompanyStatusID:CompanyStatusID, BillingState:BillingState  };
                                                          
                                                          connection.query(insert, CompanyInput ,function(err,rows){
                                                                           connection.release();
                                                                           if(!err ) {
                                                                           //we sucessfully input the data into Company ,then we should take care of the Contact Info
                                                                           //response.redirect("/chooseExistingContactBasedOnCompanyID/+"+MaxCompanyID+"/?CompanyName=\""+CompanyName)+"\"";
                                                                           jumpToChoose(request,response,MaxCompanyID);
                                                                           }
                                                                           else{
                                                                           
                                                                           response.render('addNewCompanyAdmin',{ title:title ,errorMessage:'Failed to insert into Company'});
                                                                           
                                                                           }
                                                                           });
                                                          
                                                          }
                                                          else{console.log("error in finding max CompanyID" );
                                                          response.render('addNewCompanyAdmin',{ title:title ,errorMessage:'Failed to find max CompanyID'});
                                                          }
                                                          }//end if(!err) around line 304
                                                          else{
                                                          fs.readFile(template, function(err, data) {
                                                                      
                                                                      var output = ejs.render(data.toString(), {title:title,errorMessage:'Something Error in find Max CompanyID'});//,urlLink:url});
                                                                      response.setHeader('Content-type', 'text/html');
                                                                      response.end(output);
                                                                      });}});}}
                                         
                                         //-----------------------------------------------------------------------------------------
                                         //something error in queryClause
                                         else{
                                         fs.readFile(template, function(err, data) {
                                                     

                                                     var output = ejs.render(data.toString(), {title:title,errorMessage:'Something Error in Select specific Company'});//,urlLink:url});
                                                     response.setHeader('Content-type', 'text/html');
                                                     response.end(output);
                                                     });
                                         }
                                         
                                         });
                        connection.on('error', function(err) {response.json({"code" : 100, "status" : "Error in connection database"});return;});
                        
                        });
    
    

}
}


function jumpToChoose(req,res,selectedCompanyID){
    var dataForShowing1=new Array();
    var choice = req.body.Company;
    console.log("selected CompanyID "  +selectedCompanyID);
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            var countCompanyID=0;
                            var CompanyID;
                            var CompanyName;
                            var queryClause2 = "Select x.countt as countCompanyID,CompanyID as ci, CompanyName as cn, BillingAddress as ba, BillingCity as bc, BillingState as bs, BillingZip as bz, BillingContactFirstName as bcfn, BillingContactLastName as bcln,BillingContactEmail as bce, BillingContactPhone as bcp, CompanyStatusID as csid From Company,(select count(*) as countt FROM Company) as x Order by CompanyName ";
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                             countCompanyID = rows[0].countCompanyID;
                                             CompanyID = new Array(countCompanyID);
                                             CompanyName = new Array(countCompanyID);
                                             for(var i =0; i <countCompanyID ; i++)
                                             {
                                             if (rows[i]!=null && rows[i].ci!= undefined)
                                             {
                                             
                                             
                                             dataForShowing1[i]=new Array(12);
                                             CompanyID[i]=rows[i].ci;
                                             CompanyName[i]=rows[i].cn;
                                             //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                             // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                             //console.log("");
                                             dataForShowing1[i][0]=rows[i].ci;
                                             
                                             dataForShowing1[i][1]=rows[i].cn;
                                             dataForShowing1[i][2]=rows[i].ba;
                                             dataForShowing1[i][3]=rows[i].bc;
                                             dataForShowing1[i][4]=rows[i].bs;
                                             dataForShowing1[i][5]=rows[i].bz;
                                             dataForShowing1[i][6]=rows[i].bcfn;
                                             dataForShowing1[i][7]=rows[i].bcln;
                                             dataForShowing1[i][8]=rows[i].bce;
                                             dataForShowing1[i][9] = rows[i].bcp;
                                             dataForShowing1[i][10] = rows[i].csid;
                                             
                                             }
                                             
                                             else{console.log("no company records");
                                             
                                             
                                             }
                                             
                                             }
                                             // console.log('CompanyCount = ' + countCompanyID);
                                             //;console.log(CompanyID);
                                             res.render('chooseExistingCompanyadmin', {h1:'Select Company',use:{username:'Administrator'},title:'The result of all Companys',CompanyCount:countCompanyID,CompanyID:CompanyID,CompanyName:CompanyName,dataForShowingE:dataForShowing1,selectedCompanyID:selectedCompanyID});
                                             }
                                             else{
                                             console.log('error in Select CompanyInfo!');
                                             
                                             res.render('errorPage', {usernameE: username,h1:'Error in Select Company Infomation',title:"Error in Select ComapnyInfo",errorMessage :'Error in Select CompanyInfo!'});
                                             return;
                                             }
                                             
                                             
                                             
                                             
                                             
                                             
                                             });
                            });
    

}
