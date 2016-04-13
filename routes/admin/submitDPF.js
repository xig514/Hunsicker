var mysql = require('mysql');
var ejs = require('ejs');



var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             
                             
                             });

exports.submitDPF =function(req,res)
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
                
                
                
                

    
    var DPFID = req.query.key;
   
    //  console.log('req.body'+JSON.stringify(req.body));
    // console.log('partnumber' +req.body.PartNumber);
    var input = {};
   // input.TimesCleaned = req.body.TimesCleaned;
     // console.log(input);
    
    //var TimesCleaned=
    if(DPFID=='newDPF'){
        //we should first find whether this DPF is existing or not.
        poolH.getConnection(function (err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            else{
                        
                        query0 = "SELECT TimesCleaned as tc, DPFID as di From DPFDOC WHERE PartNumber= " +connection.escape(req.body.PartNumber)+" and  SerialNumber = "+connection.escape(req.body.SerialNumber)+"and OtherNumber = "+ connection.escape(req.body.OtherNumber)+";";
                            console.log(query0);
                            connection.query(query0, function(err,rows){
                                             if(!err){
                                             if(rows[0]!=null &&rows[0].tc!=undefined&&rows.length==1)
                                             {
                                             //we found that DPF then, TimesCleaned+1, Link the Job with DPFID and return;
                                             var TimesCleaned_Old = rows[0].tc;
                                             var DPFID_Selected = rows[0].di;
                                             
                                             
                                                        //console.log(sN);
                                             
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
                                             
                                                              input.TimesCleaned=TimesCleaned_Old+1;
                                                              console.log(input);
                                             
                                                              //then we make an insertion
                                                              var query01 = "Update  DPFDOC set ? WHERE DPFID  = " + connection.escape(DPFID_Selected)+";";
                                                              console.log(query01);
                                                              connection.query(query01, input,function(err,rows){
                                                                               
                                                                               if(!err)
                                                                               {
                                                                               
                                                                               //then we are going link this DPFID to specific JOBID
                                                                               var input02 = {}
                                                                               input02.DPFID = DPFID_Selected;
                                                                               var query02 = "UPDATE JOB set ? WHERE JOBID = "+ connection.escape(req.body.JobID)+";";
                                                                               connection.query(query02, input02,function(err,rows){
                                                                               connection.release();
                                                                               if(!err)
                                                                               {
                                                                               var data1 ='SU';
                                                                               res.json(data1);
                                                                               }
                                                                               else{
                                                                               console.log('Failed to update Job');
                                                                               res.json('FAILED_LINK')
                                                                               }
                                                                               
                                                                                                });
                                                                               
                                                                               }
                                                                               else{
                                                                               console.log('Failed to Update Existing DPF(but you don\' know the DPFID)');
                                                                               var data1 ='FUU';
                                                                               res.json(data1);
                                                                               }
                                                                                                
                                                                               });
                                                              }
                                             
                                             
                                             
                                             else
                                             {
                                             //we didn't found that DPF, this is completely a new one, we just insert it.
                            
                            
                            var DPFID="";
                            
                            var JobLocation = req.body.Location;
                            DPFID= 'H';
                            DPFID_temp='H';
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
                            DPFID_temp+='%';
                            DPFID+=year;
                            DPFID_temp+=year;
                            
                            DPFID_temp+=JobLocation.substring(0,2);
                            DPFID+=JobLocation.substring(0,2);
                            
                            DPFID_temp+='%';
                            
                            console.log(DPFID);
                            query1 ="SELECT Max(DPFID) as dpfid FROM Hunsicker.DPFDOC where DPFID like "+ connection.escape(DPFID_temp)+";"
                            console.log(query1);
                            connection.query(query1, function(err,rows)
                                             {
                                             if(!err)
                                             {
                                             if(rows[0]==null )
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
                                             input.PartNumber = req.body.PartNumber;
                                             input.SerialNumber = req.body.SerialNumber;
                                             input.OtherNumber = req.body.OtherNumber;
                                             input.Manufacturer = req.body.Manufacturer;
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
                                             input.DPForDOC = req.body.DPForDOC;
                                             input.TypeOfSubstrate = req.body.TypeOfSubstrate;
                                             input.TimesCleaned=0;
                                             console.log(input);
                                             
                                             //then we make an insertion
                                             query2 = "Insert into DPFDOC set ?";
                                             connection.query(query2, input,function(err,rows){
                                                              
                                                              if(!err)
                                                              {
                                                              
                                                              //then we add the link between Job and DPFDOC
                                                              var input12 = {}
                                                              input12.DPFID = input.DPFID;
                                                              var query12 = "UPDATE JOB set ? WHERE JOBID = "+ connection.escape(req.body.JobID)+";";
                                                              connection.query(query12, input12,function(err,rows){
                                                              connection.release();
                                                              if(!err)
                                                              {
                                                              var data1 ='SI';
                                                              res.json(data1);
                                                              }
                                                              else{
                                                              console.log('failed to update Job');
                                                              res.json('FAILED_LINK')
                                                              }
                                                              
                                                            });
                                                              
                                                              }
                                                              else{
                                                              console.log('Failed to Insert DPF');
                                                              var data1 ='FI';
                                                              res.json(data1);
                                                              }
                                                              });
                                             }
                                             }
                                             else{
                                             console.log('error in finding Max DPFID');
                                             var data='error in finding maxDPFID';
                                             res.json(data);
                                             }
                                             }
                                             );
                            
                                             }
                                             }//end if(!err)
                            
                            
                            
                            
                            
                                             else{
                                             //error
                                             console.log('error in finding TimesCleaned By three number!');
                                             
                                             }
                                             });

                                             }
                            connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});

                            }

                            );
    }//end if( DPFID=='newDPF')
    
    else{
        //directly update, not a new DPF
        input.PartNumber = req.body.PartNumber;
        input.SerialNumber = req.body.SerialNumber;
        input.OtherNumber = req.body.OtherNumber;
        input.Manufacturer = req.body.Manufacturer;
        input.OuterDiameter = req.body.OuterDiameter;
        input.SubstrateDiameter = req.body.SubstrateDiameter;
        input.OuterLength = req.body.OuterLength;
        input.SubstrateLength = req.body.SubstrateLength;
        input.DPForDOC = req.body.DPForDOC;
        input.TypeOfSubstrate = req.body.TypeOfSubstrate;

        poolH.getConnection(function (err,connection){
                           if (err) {
                           connection.release();
                           res.json({"code" : 100, "status" : "Error in connection database"});
                           return;
                           }
                           else{
                            console.log('DPFID='+DPFID);
                           query3= "Update DPFDOC  Set ? WHERE DPFID = "+connection.escape(DPFID)+";";
                           connection.query(query3, input,function(err,rows){
                                            connection.release();
                                            if(!err)
                                            {var data1= 'SU';
                                            console.log('Successfully to update DPFDOC');
                                            res.json(data1);
                                            
                                            }
                                            else
                                            {
                                            console.log('Failed to update DPFDOC');
                                            var data1 ='FU';
                                            res.json(data1);
                                            }
                                            
                                            
                                            });
                           }
                             connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                           });
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
