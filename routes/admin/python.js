var mysql = require('mysql');
var ejs = require('ejs');

var PythonShell = require('python-shell');



var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.show = function (req,res){
    //JobID is here
    console.log(req.query.JobID);
    var P_hot = 0;
    var options = {
    mode: 'json',
        
        //pythonOptions: ['-u'],
    scriptPath: __dirname+'/python',
    args: [0.055,0.094,0.137,0.169,0.193,0.21,0.231,0.251,0.275,0.299,0.313 ]
    };
    PythonShell.run('temp_adjust.py',options, function (err,results) {
                    if (err) throw err;
                    //console.log('results: %j' , results[0]);
                    p_hot = parseInt(results[0]);
                    res.redirect('/analysisResult');
                    return;
                    });

    
    
}
exports.showResult=function(req,res){
    
    res.render('analysisResult', {h1:"Result",title:"Analysis Result"});
}

