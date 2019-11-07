var db = require('./dbModule');
var dateModule = require('./dateModule');

exports.initProcess = function(url, obj, wordList){
    return new Promise((resolve, reject) =>{
        try{
            console.log("1");
            db.db_insert(obj, "newsCache", resolve, true);
        }catch(err){
            reject(err);
        }    
    }).then(function(result){
        return new Promise((resolve, reject) => {
            try{
                console.log("2");
                db.db_query({"url": url, "date": dateModule.singleScanTime()}, "Report",  resolve );
            }catch(err){
                reject(err);
            }
        });
        
    }).then(function(result){
        return new Promise((resolve, reject) => {
            try{
                console.log("3");
                initResultTable(result, {"obj": obj, "wordList": wordList, "index":0}, resolve)
            }catch(err){
                reject(err);
            }
        });
    }).then(function(result){
        return new Promise((resolve, reject) => {
            try{
                console.log("4");
                processResult(result, {"obj": obj, "wordList": wordList, "index":0}, resolve)
            }catch(err){
                reject(err);
            }
        });
    });    
}

let initResultTable = function(result, args, resolve){
    // if empty, populate result.   
    let obj = args.obj;
    if(!result.length){
        db.db_insert(obj, "Report", resolve, true);        
    }  
    else{
        resolve(true);
    }
  }
  
  let processResult = function(result, args, resolve){
    let obj = args.obj;
    let wordList = args.wordList;
    let index = args.index;
  
    if(index >= wordList.length)
      resolve(true);
  
    if(result.insertedId in result)
      result = obj;   
  
    db.db_query({}[wordList[index]] = {}, "Report", processResult, [obj, wordList, index+1]);   
  
    // do some kind of comparison to the scanned obj here. Update if the list is longer
    //if(result.length )
  
  }