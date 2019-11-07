var http = require('http');
var url = require('url');
var dateModule = require('./dateModule');
var ScanModule = require('./ScanModule');
var scheduler = require('node-schedule');
var db = require('./dbModule');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("The current date is " + dateModule.myDateTime() + "\n");
  res.write(req.url);    
  res.end();
}).listen(8080);

var rule = new scheduler.RecurrenceRule();
rule.second = [0,15,30,45];
rule.minute = [0, new scheduler.Range(0,59)];
rule.hour = 21;
console.log("test");

var scheduleResult = scheduler.scheduleJob(rule,function(){
  db.db_connect("mongodb://localhost:27017/", "newsScanDB", ScanModule.executeScan, 
  {
    "url" : "https://www.bnnbloomberg.ca/", // pass URL here
    "wordList" : ["china","mcdonald"] // pass list of words here
  }); 

  //ScanModule.executeScan(db_init.db, db_init.dbo);
});
