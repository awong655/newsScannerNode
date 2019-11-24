// event module
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
var request = require('request');
var db = require('../DB_Modules/dbModule');
var dateModule = require('../Util_Modules/dateModule');
var scp = require('./ScanProcessModule');
var scheduler = require('node-schedule');
var scm = require('../Scheduler_Modules/Scheduler_Module')

exports.initializeScan = function(){
  // set up scheduling rule
  let rule = scm.createScheduleRule([0,15,30,45], [0, new scheduler.Range(0,59)], 11);

  // initialize DB and strings to query by, initialize scheduler
  db.db_connect("mongodb://localhost:27017/", "newsScanDB", initScan, rule);
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
    scm.startScheduler(wordList, urlList, rule);     
  });
}

// event handler
exports.executeScan = function(url, wordList){ // args[] = list of words to search for  
  console.log("Requesting page at time " + dateModule.myDateTime());
  request(url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    handleScan(url, body, wordList);
  });
};

let handleScan = function(url, body, wordList){
  let obj = scanDoc(url, body, wordList);  
  let procInitStatus = scp.initProcess(url, obj, wordList);     
}

let scanDoc = function(url, body, wordList){
  let obj = {
    "url" : url,
    "day_requested" : dateModule.singleScanDay(),
    "dateTime_requested" : dateModule.myDateTime()
  };  
  const dom = new JSDOM(body);
  //console.log(dom.window.document.getElementsByTagName("a").length); 
  var listOfLinks = dom.window.document.getElementsByTagName("a");
  //console.log(listOfLinks.length);
  for(let i = 0; i < listOfLinks.length; i++){    
    let link = listOfLinks[i].getAttribute("href");    
    if(link !== null){
      link = link.toLowerCase();            
      for(let j = 0; j < wordList.length; j++){               
        if(link.includes(wordList[j].toLowerCase())){   // ***THIS MUST BE IN LOWER CASE   
          //let matchCount = 0; // match count for a specific word over the list of links  
          //console.log(link);
          if(obj[wordList[j]] === undefined)
            obj[wordList[j]] = []; 
          obj[wordList[j]].push(link);
        }
      }
    }        
  }  
  console.log("done one scan.");
  return obj;
}

