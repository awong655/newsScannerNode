// event module
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
var request = require('request');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var db = require('./dbModule');
var dateModule = require('./dateModule');
var scp = require('./ScanProcessModule');

// event handler
exports.executeScan = function(result, args){ // args[] = list of words to search for  
  console.log("Requesting page at time " + dateModule.singleScanTime());
 
  let wordList = args.wordList;
  let url = args.url;

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
    "date" : dateModule.singleScanTime()
  };  
  const dom = new JSDOM(body);
  console.log(dom.window.document.getElementsByTagName("a").length); 
  var listOfLinks = dom.window.document.getElementsByTagName("a");
  console.log(listOfLinks.length);
  for(let i = 0; i < listOfLinks.length; i++){    
    let link = listOfLinks[i].getAttribute("href");    
    if(link !== null){
      link = link.toLowerCase();            
      for(let j = 0; j < wordList.length; j++){               
        if(link.includes(wordList[j].toLowerCase())){   // ***THIS MUST BE IN LOWER CASE   
          //let matchCount = 0; // match count for a specific word over the list of links  
          console.log(link);
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

