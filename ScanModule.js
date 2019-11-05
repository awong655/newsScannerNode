// event module
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
var request = require('request');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var db = require('./dbModule');

// event handler
exports.executeScan = function(wordList){ // args[] = list of words to search for
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log("Requesting page at time " + time);

  request('https://www.bnnbloomberg.ca/', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    processReq(body, wordList);
  });
};

let processReq = function(body, wordList){
  let obj = scanDoc(body, wordList);
  db.db_insert(obj, "newsCache");
  db.db_query({}, "newsCache");
}

let scanDoc = function(body, wordList){
  let obj = {};  
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
          //obj[matchCount] = link;
        }
      }
    }        
  }  
  console.log("done one scan.");
  return obj;
}