// event module
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
var request = require('request');
var events = require('events');
var eventEmitter = new events.EventEmitter();

// event handler
exports.executeScan = function(){
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log("Requesting page at time " + time);

  request('https://www.bnnbloomberg.ca/', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log("success");
    scanDoc(body);
  });
}

let scanDoc = function(body){
  let matchCount = 0;
  const dom = new JSDOM(body);
  console.log(dom.window.document.getElementsByTagName("a").length); 
  var listOfLinks = dom.window.document.getElementsByTagName("a");
  console.log(listOfLinks.length);
  for(let i = 0; i < listOfLinks.length; i++){
    let link = listOfLinks[i].getAttribute("href");
    if(link !== null){
      link = link.toLowerCase();
      if(link.includes("china")){
        matchCount++;
        console.log(link);
      }
    }    
  }
  console.log("done one scan. Matches: " + matchCount);
}