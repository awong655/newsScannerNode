var http = require('http');
var url = require('url');
var dateModule = require('./dateModule');
var ScanModule = require('./ScanModule');
var scheduler = require('node-schedule');
var db = require('./dbModule');

// server listener
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("The current date is " + dateModule.myDateTime() + "\n");
  res.write(req.url);    
  res.end();
}).listen(8080);


// Create the rule for which the scheduler will be run on 
var createScheduleRule = function(seconds, minutes, hours){
  let rule = new scheduler.RecurrenceRule();
  rule.second = seconds;
  rule.minute = minutes;
  rule.hour = hours;
  return rule;
}

// Query DB for strings to scan for and URLS to scan for. Then initialize the scan
var initScan = function(rule){
  return new Promise((resolve, reject) => {
    try{
      db.db_query({"Type": { "$in": ["url","keyword"]}}, "ScanStrings", resolve, true);
    }catch(err){
      reject(err);
    }
    
  }).then(function(result){
    let wordList = null;
    let urlList = null;
    result.map(function(item){
      if(item.Type === "keyword")
        wordList = item.KeyList;
      else if(item.Type === "url")
        urlList = item.UrlList;
    });   
    // execute the job at the scheduled time
    startScheduler(wordList, urlList);     
  });
}

var startScheduler = function(wordList, urlList){  
  //(()=>{
    this.wordList = wordList;
    this.urlList = urlList;

    // use closure here to persist the values of wordList and urlList
    // since the callback will run in a different scope, wordList and urlList will be undefined
    // we wrap the callback in a closure to capture the state of the function. 
    scheduler.scheduleJob(rule, function(){
      return function(){
        urlList.map(function(url, index, arr){
          ScanModule.executeScan(url, wordList);  
        })
      }()      
    })

    // this won't work because the callback will still be called in a different scope than the function wrapping the scheduleJob call. This means that 
    // the wordList and urlList will still be cleaned out hence undefined. 
    //return function(){ 
      //   return scheduler.scheduleJob(rule,function(wordList, urlList){
      //   urlList.map(function(url, index, arr){
      //     ScanModule.executeScan(url, wordList);  
      //   })    
      // })()
    //}()
  //})()
}

// set up scheduling rule
let rule = createScheduleRule([0,15,30,45], [0, new scheduler.Range(0,59)], 23);

// initialize DB and strings to query by, initialize scheduler
db.db_connect("mongodb://localhost:27017/", "newsScanDB", initScan, rule);


