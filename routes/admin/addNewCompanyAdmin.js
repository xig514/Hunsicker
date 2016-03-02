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



exports.handle_Input=function (request,response)
{
    /*if(!request.isAuthenticated()) {
        response.redirect('/login');
        console.log('not authed in UICC.handle_input');
    } else {*/
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
                                                                           response.redirect("http://localhost:9000/chooseExistingContactBasedOnCompanyID/+"+MaxCompanyID+"/?CompanyName=\""+CompanyName)+"\"";
                                                                           //res.render('UserInputContactAndCompany',{ title:title ,usernameE: request.params.id, errorMessage:'Successfully Insertion into Company and Contact'});
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
    
    

//}
}