var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Administrator Search DPF infomation'


var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.showData=function (request,response)
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