var nodeMailer = require('nodemailer');
var scm = require('../Scheduler_Modules/Scheduler_Module')
var db = require('../DB_Modules/dbModule');
var dateModule = require('../Util_Modules/dateModule');
var emailBuilder = require('./EmailBodyBuilder')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var transporter = nodeMailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: 'alowong.scan@gmail.com',
        pass: 'testpassword1234.'
    }
});

let sendMail = function(body){
    let res = new Promise((resolve, reject) => {            
        try{
            let currentObjKey = {"_id" : 0}
            db.db_findOne({"day_requested": dateModule.singleScanDay()},                     
                currentObjKey
                , "Report", resolve);  
        }catch(err){
            reject(err);
        }
    }).then(function(result){
        if(result === null) return;
        let emailHtml = emailBuilder.buildBody(result);
        var mailOptions = {
            from: 'alowong.scan@gmail.com',
            to: 'anthony.wong3485@gmail.com',
            subject: 'Sending Email using Node.js',
            html: emailHtml
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });        
    });    
}

exports.scheduleEmail = function(){
    let rule = scm.createScheduleRule(0, 45, 9);
    scm.startEmailScheduler(rule, sendMail);
}