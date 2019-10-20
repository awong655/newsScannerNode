var http = require('http');
var url = require('url');
var dateModule = require('./firstModule');
var ScanModule = require('./ScanModule');
var scheduler = require('node-schedule');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("The current date is " + dateModule.myDateTime() + "\n");
  res.write(req.url);    
  res.end();
}).listen(8080);

var rule = new scheduler.RecurrenceRule();
rule.second = [0,15,30,45];
rule.minute = [0, new scheduler.Range(0,59)];
rule.hour = 23;

var scheduleResult = scheduler.scheduleJob(rule,function(){
  ScanModule.executeScan();
});
