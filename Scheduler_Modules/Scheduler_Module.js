var scheduler = require('node-schedule');
var scan_module = require("../Scan_Modules/ScanModule")

// Create the rule for which the scheduler will be run on 
exports.createScheduleRule = function(seconds, minutes, hours){
  let rule = new scheduler.RecurrenceRule();
  rule.second = seconds;
  rule.minute = minutes;
  rule.hour = hours;
  return rule;
}

// Run the search algorithm 
// param: wordList = list of words to search for
// param: urlList = list of URLs to search for
// param: rule = determines when scheduler will run
exports.startScanScheduler = function(wordList, urlList, rule){  
    this.wordList = wordList;
    this.urlList = urlList;

    // use closure here to persist the values of wordList and urlList
    // since the callback will run in a different scope, wordList and urlList will be undefined
    // we wrap the callback in a closure to capture the state of the function. 
    scheduler.scheduleJob(rule, function(){
      return function(){
        urlList.map(function(url, index, arr){
            scan_module.executeScan(url, wordList);  
        })
      }()      
    })    
}

exports.startEmailScheduler = function(rule, callback){
    scheduler.scheduleJob(rule, function(){
        callback();
    })    
}