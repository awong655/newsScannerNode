// event module
var events = require('events');
var eventEmitter = new events.EventEmitter();

// event handler
exports.executeScan = function(){
  console.log("It's Time");
}
/*
// listen for event
eventEmitter.on('timeEvent', timeEventHandler);

exports.fireTime = function(url){
    eventEmitter.emit('timeEvent');
}

// execute function at specific time
var execute = function(time, func){
  var currentTime = new Date().getTime();
  if(currentTime > time){
    console.error('Invalid Time: In the past');
    return false;
  }
  setTimeout(func, time-currentTime);
  return true;
}
*/