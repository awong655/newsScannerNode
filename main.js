var http = require('http');
var url = require('url');
var dateModule = require('./Util_Modules/dateModule');
var ScanModule = require('./Scan_Modules/ScanModule');
var EmailModule = require('./Report_Modules/Email_Module')
var db = require('./DB_Modules/dbModule') // TODO remove this

// server listener
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("The current date is " + dateModule.myDateTime() + "\n");
  res.write(req.url);    
  res.end();
}).listen(8080);

//db.db_connect("mongodb://localhost:27017/", "newsScanDB");
ScanModule.initializeScan();
EmailModule.scheduleEmail();


